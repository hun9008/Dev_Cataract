from fastapi import APIRouter
from fastapi import File
from fastapi import HTTPException, status, Depends, Request
from starlette.responses import JSONResponse
from schema.request_schema import ImageRequest
from PIL import Image
from models.user import User
from models.doctor import Doctor
from models.user import Pet
from config.database import collection_name_user, collection_name_post, collection_name_image, collection_name_comment, collection_name_user_post_like, collection_name_user_comment_like,fs
from schema.schemas import list_serial
from bson import ObjectId
from typing import List
import base64
import io

router = APIRouter()

## GET ALL

@router.get("/account/all_users")
async def get_users():
    users = list_serial(collection_name_user.find())
    return users
    # raw_users = collection_name_user.find()
    # users = [transform_to_class(user) for user in raw_users]
    # print("done transform_to_class", users)
    # return list_serial(users)

@router.get("/account/all_doctors")
async def get_doctors():
    users = list_serial(collection_name_user.find())
    doctors = []
    for user in users:
        if user["d_hospital"] != "":
            doctors.append(user)
    return doctors
    # raw_doctors = collection_name_doctor.find()
    # doctors = [transform_to_class(doctor) for doctor in raw_doctors]
    # print("done transform_to_class", doctors)
    # return list_serial(doctors)

## SIGN UP

@router.post("/account/signup/user")
async def post_user(user: dict):
    user_data = {
        "u_email": user["u_email"],
        "u_pwd": user["u_pwd"],
        "u_PN": user["u_PN"],
        "u_birth": user["u_birth"],
        "u_sex": user["u_sex"],
        "u_name": user["u_name"],
        "u_nickname": user["u_nickname"],
        "pet": [pet for pet in user.get("pet", [])]
    }
    if user["d_hospital"] is not None:
        user_data["d_hospital"] = user["d_hospital"]
    inserted_id = collection_name_user.insert_one(user_data).inserted_id
    user["_id"] = str(inserted_id)
    return user

#@router.post("/account/signup/doctor")
#async def post_doctor(doctor: dict):
    #doctor_data = {
        #"d_email": doctor["d_email"],
        #"d_pwd": doctor["d_pwd"],
        #"d_PN": doctor["d_PN"],
        #"d_name": doctor["d_name"],
        #"d_nickname": doctor["d_nickname"],
        #"d_hospital": doctor["d_hospital"]
    #}
    #inserted_id = collection_name_doctor.insert_one(doctor_data).inserted_id
    #doctor["_id"] = str(inserted_id)
    #return doctor

## LOGIN

@router.post("/account/login/user")
async def login_user(request: dict):
    u_email = request["u_email"]
    u_pwd = request["u_pwd"]
    user = collection_name_user.find_one({"u_email": u_email, "u_pwd": u_pwd})
    if user:
        user["_id"] = str(user["_id"])
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found or password incorrect")

#@router.post("/account/login/doctor")
#async def login_doctor(request: dict):
#    d_email = request["d_email"]
#    d_pwd = request["d_pwd"]
#    doctor = collection_name_doctor.find_one({"d_email": d_email, "d_pwd": d_pwd})
#    if doctor:
#        doctor["_id"] = str(doctor["_id"])
#        return doctor
#    else:
#        raise HTTPException(status_code=404, detail="Doctor not found or password incorrect")

## DELETE

@router.delete("/account/delete/user")
async def delete_user(user : dict):
    collection_name_user.delete_one({"u_email": user["u_email"]})
    return user

#@router.delete("/account/delete/doctor")
#async def delete_doctor(d_email: str):
#    collection_name_doctor.delete_one({"d_email": d_email})
#    return d_email

@router.delete("/account/clear/user")
async def clear_user():
    collection_name_user.delete_many({})
    return "All users are deleted"

#@router.delete("/account/clear/doctor")
#async def clear_doctor():
#    collection_name_doctor.delete_many({})
#    return "All doctors are deleted"

# add pet
@router.post("/account/user/{user_id}/pet")
async def post_pet(user_id: str, pet: dict):
    pet_data = {
        "p_name": pet["p_name"],
        "p_type": pet["p_type"],
        "p_color": pet["p_color"],
        "p_age": pet["p_age"]
    }
    collection_name_user.update_one({"_id": ObjectId(user_id)}, {"$push": {"pet": pet_data}})
    return pet


## post article
@router.get("/posting/feed_all")
async def get_feed_all():
    posts = list_serial(collection_name_post.find())
    return posts

@router.get("/posting/feed")
async def get_feed(u_id: str):
    posts = list_serial(collection_name_post.find({"u_id": u_id}))
    return posts

@router.post("/posting/feed")
async def post_feed(post: dict):
    image_ids = []
    for image_data in post["im_list"]:
        image_bytes = base64.b64decode(image_data)
        image_id = fs.put(image_bytes)
        image_record = {
            "filename": "base64_image",  # 실제 파일명을 원하면 클라이언트에서 받도록 수정 가능
            "image_id": image_id
        }
        collection_name_image.insert_one(image_record)
        image_ids.append(str(image_id))
    
    post_data = {
        "po_detail": post["po_detail"],
        "user_id": post["user_id"],
        "im_list": image_ids
    }
    inserted_id = collection_name_post.insert_one(post_data).inserted_id
    return {"_id": str(inserted_id)}

@router.delete("/posting/feed")
async def delete_feed(post_id: str):
    collection_name_post.delete_one({"_id": ObjectId(post_id)})
    return post_id

# comment
@router.post("/posting/feed/{post_id}/comment")
async def post_comment(post_id: str, comment: dict):
    comment_data = {
        "co_detail": comment["co_detail"],
        "user_id": comment["user_id"],
        "post_id": post_id
    }
    inserted_id = collection_name_comment.insert_one(comment_data).inserted_id
    comment["_id"] = str(inserted_id)
    return comment

@router.get("/posting/feed/{post_id}/comment")
async def get_comment(post_id: str):
    comments = list_serial(collection_name_comment.find({"post_id": post_id}))
    return comments

@router.delete("/posting/feed/{post_id}/comment/{comment_id}")
async def delete_comment(comment_id : str):
    if collection_name_comment.find_one({"_id": ObjectId(comment_id)}):
        collection_name_comment.delete_one({"_id": ObjectId(comment_id)})
    return comment_id

## like
@router.post("/posting/feed/{post_id}/like")
async def post_like(post_id: str, user_post_like: dict):
    user_post_like_data = {
        "user_id": user_post_like["user_id"],
        "po_id": post_id
    }
    post = collection_name_post.find_one({"_id": ObjectId(post_id)})
    for like in post["like_list"]:
        if like["user_id"] != user_post_like["user_id"]:
            post_like_id = collection_name_user_post_like.insert_one(user_post_like_data).inserted_id
            user_post_like["_id"] = str(post_like_id)
    return user_post_like

@router.post("/posting/feed/{post_id}/comment/{comment_id}/like")
async def post_comment_like(comment_id: str, user_comment_like: dict):
    user_comment_like_data = {
        "user_id": user_comment_like["user_id"],
        "co_id": comment_id
    }
    comment = collection_name_comment.find_one({"_id": ObjectId(comment_id)})
    for like in comment["like_list"]:
        if like["user_id"] != user_comment_like["user_id"]:
            comment_like_id = collection_name_user_comment_like.insert_one(user_comment_like_data).inserted_id
            user_comment_like["_id"] = str(comment_like_id)
    return user_comment_like

@router.get("/posting/feed/{post_id}/like")
async def get_like(post_id: str):
    post = collection_name_post.find_one({"_id": ObjectId(post_id)})
    like_list = post["like_list"]
    return like_list

@router.get("/posting/feed/{post_id}/comment/{comment_id}/like")
async def get_comment_like(comment_id: str):
    comment = collection_name_comment.find_one({"_id": ObjectId(comment_id)})
    like_list = comment["like_list"]
    return like_list

@router.delete("/posting/feed/{post_id}/like")
async def post_delete_like(post_id : str, user_post_like: dict):
    collection_name_user_post_like.delete_one({"po_id": post_id, "user_id": user_post_like["user_id"]})
    return user_post_like
    
@router.delete("/posting/feed/{post_id}/comment/{comment_id}/like")
async def post_delete_comment_like(comment_id : str, user_comment_like: dict):
    collection_name_user_comment_like.delete_one({"co_id": comment_id, "user_id": user_comment_like["user_id"]})
    return user_comment_like