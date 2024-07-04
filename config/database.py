from pymongo import MongoClient

client = MongoClient("mongodb+srv://younghune135:pICR3hE7XLDdVxUe@cataract.4vpi9yq.mongodb.net/?appName=cataract")

db = client.account

collection_name_user = db["user"]
collection_name_doctor = db["doctor"]