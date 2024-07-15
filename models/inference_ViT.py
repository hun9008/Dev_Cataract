import tensorflow as tf
import numpy as np
from PIL import Image
import keras
# from vit_keras import vit
import os
import base64
import cv2
import io
import matplotlib.pyplot as plt
from keras.models import load_model
import tensorflow_addons as tfa
from vit_keras import vit
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import confusion_matrix, classification_report
from tensorflow.keras.callbacks import EarlyStopping

# model_path = os.path.abspath('./models/weights/ViT.h5')
# model = load_model(model_path)
# print(model.summary())
def vit_inference(encoding_img : str) -> dict:
    # img = Image.open(base64.b64decode(encoding_img))
    # plt.imshow(img)
    # print(io.BytesIO(base64.b64decode(encoding_img)))
    img = Image.open(io.BytesIO(base64.b64decode(encoding_img)))
    print("img type : ",type(img))
    # data = cv2.imread(img)
    data = np.array(img)

    data = cv2.cvtColor(data, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(data, cv2.COLOR_RGB2GRAY)

    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)

    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_area = 0
    best_cnt = None

    for countour in contours:
        area = cv2.contourArea(countour)
        if area > max_area:
            max_area = area
            best_cnt = countour

    x, y, w, h = cv2.boundingRect(best_cnt)
    data = data[y:y+h, x:x+w]
    resize_eye = cv2.resize(data, dsize=(224, 224), interpolation=cv2.INTER_AREA)

    mask = np.zeros(resize_eye.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    rect = (40,40,400,178)
    cv2.grabCut(resize_eye, mask, rect, bgdModel, fgdModel, 10, cv2.GC_INIT_WITH_RECT)
    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
    final = resize_eye * mask2[:,:,np.newaxis]

    gray = cv2.cvtColor(final, cv2.COLOR_RGB2GRAY)

    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)

    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_area = 0
    best_cnt = None

    for countour in contours:
        area = cv2.contourArea(countour)
        if area > max_area:
            max_area = area
            best_cnt = countour

    x, y, w, h = cv2.boundingRect(best_cnt)
    final = final[y:y+h, x:x+w]
    resize_eye = cv2.resize(final, dsize=(224, 224), interpolation=cv2.INTER_AREA)

    blurred = cv2.GaussianBlur(resize_eye, (5, 5), 1.2)
    print("blur type : ",type(blurred))
    print("blur shape : ",blurred.shape)

    blurred = blurred / 255.0
    blurred = blurred - np.mean(blurred)



    vit_model = vit.vit_b32(
        image_size = 224,
        activation = 'softmax',
        pretrained = True,
        include_top = False,
        pretrained_top = False,
        classes = 4)

    model = tf.keras.Sequential([
            vit_model,
            tf.keras.layers.Flatten(),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(11, activation = tfa.activations.gelu),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(4, 'softmax')
        ],
        name = 'vision_transformer')
    learning_rate = 1e-4

    optimizer = tfa.optimizers.RectifiedAdam(learning_rate=learning_rate)

    model.compile(optimizer = optimizer,
                    loss = tf.keras.losses.CategoricalCrossentropy(label_smoothing = 0.2),
                    metrics = ['accuracy'])
    
    model_path = './models/weights/ViT.h5'
    model.load_weights(model_path)
    
    # preprocessed = preprocess_image(image_array)
    blurred = np.expand_dims(blurred, axis=0)
    blurred = np.reshape(blurred, (-1, 224, 224, 3))
    print("Final input shape for prediction:", blurred.shape)
    predictions = model.predict(blurred)
    print("prediction : ", predictions)
    predicted_class_num = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0]))

    classes = ['overripe', 'no', 'mature', 'incipient']

    predicted_class = classes[predicted_class_num]

    print("predicted_class : ", predicted_class)
    print("probability : ", confidence)

    pred_dict = {
        "predicted_class" : predicted_class,
        "probability" : confidence,
        "all_predictions" : predictions,
    }


    return pred_dict