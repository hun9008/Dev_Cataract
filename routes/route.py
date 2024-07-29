from fastapi import APIRouter
from fastapi import File
from fastapi import HTTPException, status, Depends, Request
from starlette.responses import JSONResponse
from schema.request_schema import ImageRequest
from PIL import Image
from models.user import User, LoginRequest
from models.user import Pet
from models.post import Post, Comment, UserPostLike, UserCommentLike, Predict
from models.hospital import get_hospitals
from config.database import collection_name_user, collection_name_post, collection_name_image, collection_name_comment, collection_name_user_post_like, collection_name_user_comment_like, collection_name_predict, fs
from schema.schemas import list_serial
from bson import ObjectId
from typing import List
import base64
import io
from fastapi.encoders import jsonable_encoder

router = APIRouter()

## GET ALL

@router.get("/account/all_users")
async def get_users():
    users = list_serial(collection_name_user.find())
    return users

@router.get("/account/all_doctors")
async def get_doctors():
    users = list_serial(collection_name_user.find())
    doctors = []
    for user in users:
        if "d_hospital" in user:
            doctors.append(user)
    return doctors

## SIGN UP

@router.post("/account/signup/user")
async def post_user(user: User):
    user_data = {
        "u_email": user.u_email,
        "u_pwd": user.u_pwd,
        "u_PN": user.u_PN,
        "u_birth": user.u_birth,
        "u_sex": user.u_sex,
        "u_name": user.u_name,
        "u_nickname": user.u_nickname,
        "pet": [pet.dict() for pet in user.pet] if user.pet else []
    }
    if user.role == "doctor":
        user_data["type"] = "doctor"
        user_data["d_hospital"] = user.d_hospital
    elif user.role == "user":
        user_data["type"] = "user"
        user_data["d_hospital"] = None
        
    json_data = jsonable_encoder(user_data)
    collection_name_user.insert_one(json_data).inserted_id
    return user_data

## LOGIN

@router.post("/account/login/user")
async def login_user(request: LoginRequest):
    u_email = request.u_email
    u_pwd = request.u_pwd
    user = collection_name_user.find_one({"u_email": u_email, "u_pwd": u_pwd})
    if user:
        user["_id"] = str(user["_id"])
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found or password incorrect")

@router.delete("/account/delete/user")
async def delete_user(user_id : str):
    collection_name_user.delete_one({"_id" : ObjectId(user_id)})
    return user_id

@router.delete("/account/clear/user")
async def clear_user():
    collection_name_user.delete_many({})
    return "All users are deleted"

# add pet
@router.post("/account/user/pet")
async def post_pet(user_id : str, pet: Pet):
    pet_data = {
        "p_name": pet["p_name"],
        "p_type": pet["p_type"],
        "p_color": pet["p_color"],
        "p_age": pet["p_age"]
    }
    collection_name_user.update_one({"_id": ObjectId(user_id)}, {"$push": {"pet": pet_data}})
    return pet

# post predict
@router.post("/account/user/predict")
async def post_predict(user_id : str, predict: Predict, pet_name: str):
    predict_data = {
        "predicted_class": predict.predicted_class,
        "probability": predict.probability,
        "all_probability": predict.all_probability,
        "lime" : predict.lime,
        "date" : predict.date
    }
    user_data = collection_name_user.find_one({"_id" : ObjectId(user_id)})
    for pet in user_data["pet"]:
        if pet["p_name"] == pet_name:
            pet["predict"] = predict_data
    
    return "Predict added"


## post article
@router.get("/posting/feed_all")
async def get_feed_all():
    posts = list_serial(collection_name_post.find())
    return posts

@router.post("/posting/feed")
async def post_feed(post: Post, user_id : str):
    user_record = collection_name_user.find_one({"_id" : ObjectId(user_id)})
    image_ids = []
    for image_data in post.image:
        image_record = {
            "filename": image_data.filename,  # 실제 파일명을 원하면 클라이언트에서 받도록 수정 가능
            "image_encoded": image_data.image_encoded
        }
        collection_name_image.insert_one(image_record)
        image_ids.append(image_record)
    post_data = {
        "po_detail": post.po_detail,
        "user_id": user_record["_id"],
        "type" : user_record["type"],
        "image": image_ids,   
        "pet" : post.pet
    }
    inserted_id = collection_name_post.insert_one(post_data).inserted_id
    return {"_id": str(inserted_id)}

@router.get("/posting/feed{post_id}")
async def get_feed(post_id: str):
    post = collection_name_post.find_one({"_id": ObjectId(post_id)})
    return post    

@router.delete("/posting/feed/{post_id}")
async def delete_feed(post_id: str):
    collection_name_post.delete_one({"_id": ObjectId(post_id)})
    return post_id

# comment
@router.post("/posting/feed/{post_id}/comment")
async def post_comment(post_id: str, comment: Comment, user_id : str):
    user_record = collection_name_user.find_one({"_id" : ObjectId(user_id)})
    comment_data = {
        "co_detail": comment.co_detail,
        "user_id": user_record["_id"],
        "type" : user_record["type"],
        "post_id": ObjectId(post_id)
    }
    inserted_id = collection_name_comment.insert_one(comment_data).inserted_id
    return {"message" : "Commented", "_id": str(inserted_id)}

@router.get("/posting/feed/{post_id}/comment")
async def get_comment(post_id: str):
    comments = list_serial(collection_name_comment.find({"post_id": ObjectId(post_id)}))
    return comments

@router.delete("/posting/feed/{post_id}/comment/{comment_id}")
async def delete_comment(comment_id : str, user_id : str):
    if collection_name_comment.find_one({"_id": ObjectId(comment_id), "user_id": ObjectId(user_id)}):
        collection_name_comment.delete_one({"_id": ObjectId(comment_id)})
    return comment_id

## like
@router.post("/posting/feed/{post_id}/like")
async def post_like(post_id: str, user_id : str):
    user_post_like_data = {
        "user_id": ObjectId(user_id),
        "po_id": ObjectId(post_id)
    }
    post = collection_name_post.find_one({"_id": ObjectId(post_id)})
    if "like_list" not in post:
        post["like_list"] = []
    for like in post["like_list"]:
        if like["user_id"] == user_post_like_data["user_id"]:
            return {"message": "Already liked"}
    collection_name_post.update_one({"_id": ObjectId(post_id)}, {"$push": {"like_list": user_post_like_data}})
    return {"message": "Liked"}

@router.post("/posting/feed/{post_id}/comment/{comment_id}/like")
async def post_comment_like(comment_id: str, user_id : str):
    user_comment_like_data = {
        "user_id": ObjectId(user_id),
        "co_id": ObjectId(comment_id)
    }
    comment = collection_name_comment.find_one({"_id": ObjectId(comment_id)})
    if "like_list" not in comment:
        comment["like_list"] = []
    for like in comment["like_list"]:
        if like["user_id"] == user_comment_like_data["user_id"]:
            return {"message": "Already liked"}
    collection_name_comment.update_one({"_id": ObjectId(comment_id)}, {"$push": {"like_list": user_comment_like_data}})
    return {"message": "Liked"}

@router.get("/posting/feed/{post_id}/like")
async def get_like(post_id: str):
    post = collection_name_post.find_one({"_id": ObjectId(post_id)})
    like_list = post["like_list"]
    for like in like_list:
        like["user_id"] = str(like["user_id"])
        like["po_id"] = str(like["po_id"])
    return like_list

@router.get("/posting/feed/{post_id}/comment/{comment_id}/like")
async def get_comment_like(comment_id: str):
    comment = collection_name_comment.find_one({"_id": ObjectId(comment_id)})
    like_list = comment["like_list"]
    for like in like_list:
        like["user_id"] = str(like["user_id"])
        like["co_id"] = str(like["co_id"])
    return like_list

@router.delete("/posting/feed/{post_id}/like")
async def post_delete_like(post_id : str, user_id : str):
    collection_name_user_post_like.delete_one({"po_id": ObjectId(post_id), "user_id": ObjectId(user_id)})
    return post_id

@router.delete("/posting/feed/{post_id}/comment/{comment_id}/like")
async def post_delete_comment_like(comment_id : str, user_id : str):
    collection_name_user_comment_like.delete_one({"co_id": ObjectId(comment_id), "user_id": ObjectId(user_id)})
    return comment_id

# 주변 병원 검색
@router.get("/hospital")
async def get_hospital(region : str):
    hospitals = get_hospitals(region)
    return hospitals