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
from skimage.segmentation import mark_boundaries
from lime import lime_image
from tensorflow.keras.preprocessing import image
import torch
from torch.nn import functional as F
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image, preprocess_image
from torchvision.transforms import Compose, Resize, ToTensor, Normalize
from transformers import ViTModel, ViTConfig
import timm

def pred_function(image, model):
    image = np.expand_dims(image, axis=0)
    return model.predict(image)

def visualize_image(image_data, model):

    classes = ['overripe', 'no', 'mature', 'incipient']
    explainer = lime_image.LimeImageExplainer()

    image = image_data

    # figure = plt.figure(figsize=(10, 10))

    def model_predict(input_data):
        return model.predict(input_data)


    explanation = explainer.explain_instance(image, model_predict, top_labels=1, hide_color=0, num_samples=1000)
    temp, mask = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=False, num_features=5, hide_rest=False)
    marked_image = mark_boundaries(temp / 2 + 0.5, mask)

    # plt.imshow(marked_image)
    # plt.title(classes[explanation.top_labels[0]])
  
    # plt.tight_layout()
    # plt.show()

    img = Image.fromarray((marked_image * 255).astype(np.uint8))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    byte_data = buffer.getvalue()

    encoding_img = base64.b64encode(byte_data).decode('utf-8')
    print("encoding_img : ", encoding_img)
    print("encoding type : ", type(encoding_img))
    return encoding_img


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
    
    vit_result = vit_grad_cam(img, 0)
    # print('vit_result : ', vit_result)
    vit_result = Image.fromarray(vit_result)
    buffer = io.BytesIO()
    vit_result.save(buffer, format="PNG")
    vit_encoding_img = base64.b64encode(buffer.getvalue()).decode('utf-8')
    # print("vit_encoding_img : ", vit_encoding_img)

    # preprocessed = preprocess_image(image_array)
    blurred = np.expand_dims(blurred, axis=0)
    lime_image = blurred
    blurred = np.reshape(blurred, (-1, 224, 224, 3))
    print("Final input shape for prediction:", blurred.shape)
    predictions = model.predict(blurred)
    print("prediction : ", predictions)
    predicted_class_num = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0]))

    classes = ['overripe', 'no', 'mature', 'incipient']

    predicted_class = classes[predicted_class_num]

    grayed_lime = lime_image[0]
    print("lime image shape : ", grayed_lime.shape)
    lime_output = visualize_image(grayed_lime, model)

    print("predicted_class : ", predicted_class)
    print("probability : ", confidence)

    pred_dict = {
        "predicted_class" : predicted_class,
        "probability" : confidence,
        "all_predictions" : predictions,
        "lime" : lime_output,
        "vit" : vit_encoding_img
    }



    return pred_dict


def reshape_transform(tensor, height=14, width=14):
    result = tensor[:, 1:, :].reshape(tensor.size(0),
                                      height, width, tensor.size(2))

    # Bring the channels to the first dimension,
    # like in CNNs.
    result = result.transpose(2, 3).transpose(1, 2)
    return result

def vit_grad_cam(image, class_idx):
    # Load ViT model
    # model = torch.hub.load('facebookresearch/deit:main',
    #                        'deit_tiny_patch16_224', pretrained=True)

    model = timm.create_model('vit_base_patch16_224', pretrained=True)
    
    model.eval()
    target_layers = [model.blocks[-1].norm1]

    # rgb_img = cv2.imread(image, 1)[:, :, ::-1]
    print("image type : ",type(image))
    # print("image shape : ",image.shape)3
    rgb_img = np.array(image)
    rgb_img = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR)
    # rgb_img = cv2.imread(image, 1)[:, :, ::-1]
    rgb_img = cv2.resize(rgb_img, (224, 224))
    rgb_img = np.float32(rgb_img) / 255
    input_tensor = preprocess_image(rgb_img, mean=[0.5, 0.5, 0.5],
                                    std=[0.5, 0.5, 0.5])

    cam = GradCAM(model=model, target_layers=target_layers, reshape_transform=reshape_transform)
    grayscale_cam = cam(input_tensor=input_tensor)

    grayscale_cam = grayscale_cam[0, :]
    cam_image = show_cam_on_image(rgb_img, grayscale_cam)
    # plt.imshow(cam_image)
    return cam_image