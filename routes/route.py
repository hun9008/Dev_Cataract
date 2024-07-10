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
import matplotlib.pyplot as plt
from PIL import Image

router = APIRouter()

@router.post("/inference")
async def inference(img: dict):
    encoding_img = img["img"]
    print("encoding_type", type(encoding_img))
    # print(encoding_img)
    # print(type(encoding_img))
    # print(output)
    # encoding_output = base64.b64encode(output)
    # output = preprocess_image(encoding_img)
    # print(output)
    
    output = vit_inference(encoding_img)

    # print(output)

    return output
    
