import tensorflow as tf
import numpy as np
from PIL import Image
import keras
# from vit_keras import vit
import os

model_path = os.path.abspath('./models/weights/ViT.h5')
model = tf.keras.models.load_model(model_path)

def preprocess_image(image: Image.Image, target_size: tuple = (224, 224)):
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def predict(image_array):
    predictions = model.predict(image_array)
    predicted_class = np.argmax(predictions[0])
    confidence = float(np.max(predictions[0]))
    return predicted_class, confidence