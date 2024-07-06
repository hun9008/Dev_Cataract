from fastapi import APIRouter
from fastapi import File, UploadFile
from fastapi import HTTPException, status, Depends, Request
from models.user import User
from models.doctor import Doctor
from models.user import Pet
from config.database import collection_name_user, collection_name_doctor, collection_name_post, collection_name_image, fs
from schema.schemas import list_serial
from bson import ObjectId
from typing import List

router = APIRouter()

## GET ALL

@router.get("/account/all_users")
async def get_users():
    users = list_serial(collection_name_user.find())
    return users

@router.get("/account/all_doctors")
async def get_doctors():
    doctors = list_serial(collection_name_doctor.find())
    return doctors

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
    inserted_id = collection_name_user.insert_one(user_data).inserted_id
    user["_id"] = str(inserted_id)
    return user

@router.post("/account/signup/doctor")
async def post_doctor(doctor: dict):
    doctor_data = {
        "d_email": doctor["d_email"],
        "d_pwd": doctor["d_pwd"],
        "d_PN": doctor["d_PN"],
        "d_name": doctor["d_name"],
        "d_nickname": doctor["d_nickname"],
        "d_hospital": doctor["d_hospital"]
    }
    inserted_id = collection_name_doctor.insert_one(doctor_data).inserted_id
    doctor["_id"] = str(inserted_id)
    return doctor

## LOGIN

@router.post("/account/login/user")
async def login_user(u_email: str, u_pwd: str):
    user = collection_name_user.find_one({"u_email": u_email, "u_pwd": u_pwd})
    if user:
        user["_id"] = str(user["_id"])
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found or password incorrect")

@router.post("/account/login/doctor")
async def login_doctor(d_email: str, d_pwd: str):
    doctor = collection_name_doctor.find_one({"d_email": d_email, "d_pwd": d_pwd})
    if doctor:
        doctor["_id"] = str(doctor["_id"])
        return doctor
    else:
        raise HTTPException(status_code=404, detail="Doctor not found or password incorrect")

## DELETE

@router.delete("/account/delete/user")
async def delete_user(u_email: str):
    collection_name_user.delete_one({"u_email": u_email})
    return u_email

@router.delete("/account/delete/doctor")
async def delete_doctor(d_email: str):
    collection_name_doctor.delete_one({"d_email": d_email})
    return d_email

@router.delete("/account/clear/user")
async def clear_user():
    collection_name_user.delete_many({})
    return "All users are deleted"

@router.delete("/account/clear/doctor")
async def clear_doctor():
    collection_name_doctor.delete_many({})
    return "All doctors are deleted"

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
async def post_feed(post : dict, images: List[UploadFile] = File([])):
    image_ids = []
    for image in images:
        image_id = fs.put(image.file, filename=image.filename)
        image_data = {
            "filename": image.filename,
            "image_id": image_id
        }
        inserted_id = collection_name_image.insert_one(image_data).inserted_id
        image_ids.append(str(image_id))
    post_data = {
        "po_detail" : post["po_detail"],
        "im_ids" : image_ids
    }
    inserted_id = collection_name_post.insert_one(post_data).inserted_id
    post["_id"] = str(inserted_id)
    return post

