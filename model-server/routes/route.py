from fastapi import APIRouter
from fastapi import File
from fastapi import HTTPException, status, Depends, Request
from models.user import User
from models.user import Pet
from config.database import collection_name_user, collection_name_doctor, collection_name_post, collection_name_image, collection_name_comment, collection_name_pet,fs
from schema.schemas import list_serial
from bson import ObjectId
from typing import List
import base64
from models.inference_ViT import vit_inference
# from models.inference_ViT import inference
from models.infer import Infer
from models.infer import InferTest
import matplotlib.pyplot as plt
from PIL import Image
import json
import numpy as np

router = APIRouter()

# print("py_version : ", python.__version__)

@router.post("/inference")
async def inference(infer: Infer):
    encoding_img = infer.img
    user_id = infer.user_id
    pet_name = infer.pet_name
    # print("encoding_type", type(encoding_img))
    output_dict = vit_inference(encoding_img)
    # print("output_dict type : ", type(output_dict))



    def numpy_converter(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()  # numpy 배열을 리스트로 변환
        raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)

    # json_str = json.dumps(output, default=numpy_converter)
    
    # ndarray to string
    all_predictions_str = output_dict["all_predictions"].tolist()
    print("all_predictions_str : ", all_predictions_str)
    print("type : ", type(all_predictions_str))

    output = {
        "predicted_class" : output_dict["predicted_class"],
        "probability" : output_dict["probability"],
        "all_probability" : all_predictions_str,
        "lime" : output_dict["lime"],
        "vit" : output_dict["vit"]
    }
    print("output type : ", type(output))

    predict_data = output

    try:
        update_result = collection_name_user.update_one(
            {"_id": ObjectId(user_id), "pet.p_name": pet_name},
            {"$set": {"pet.$.predict": predict_data}}
        )
        if update_result.modified_count == 0:
            print(f"No document found with user_id {user_id} and pet_name {pet_name}")
        else:
            print("Document updated successfully")

    except Exception as e:
        print(f"Error updating MongoDB: {e}")
    return output
    
@router.get("/account/all_users")
async def get_users():
    users = list_serial(collection_name_user.find())
    return users

@router.post("/inference/test")
async def inference(infer: InferTest):
    encoding_img = infer.img
    # print("encoding_type", type(encoding_img))
    
    output_dict = vit_inference(encoding_img)
    # print("output_dict type : ", type(output_dict))



    def numpy_converter(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()  # numpy 배열을 리스트로 변환
        raise TypeError("Object of type '%s' is not JSON serializable" % type(obj).__name__)

    # json_str = json.dumps(output, default=numpy_converter)
    
    # ndarray to string
    all_predictions_str = output_dict["all_predictions"].tolist()
    print("all_predictions_str : ", all_predictions_str)
    print("type : ", type(all_predictions_str))

    output = {
        "predicted_class" : output_dict["predicted_class"],
        "probability" : output_dict["probability"],
        "all_probability" : all_predictions_str,
        "lime" : output_dict["lime"],
        "vit" : output_dict["vit"]
    }
    print("output type : ", type(output))

    return output