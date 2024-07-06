from pymongo import MongoClient
from gridfs import GridFS

client = MongoClient("mongodb+srv://younghune135:pICR3hE7XLDdVxUe@cataract.4vpi9yq.mongodb.net/?appName=cataract")

db = client.account

collection_name_user = db["user"]
collection_name_doctor = db["doctor"]
collection_name_pet = db["pet"]
collection_name_post = db["post"]
collection_name_comment = db["comment"]
collection_name_image = db["image"]
collection_name_user_post_like = db["user_post_like"]
collection_name_user_comment_like = db["user_comment_like"]
fs = GridFS(db)