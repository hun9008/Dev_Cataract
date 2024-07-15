from models.user import User
from models.doctor import Doctor
from typing import Union, List

def individual_serial(data: dict) -> dict:
    if "u_email" in data:
        pets_data = []
        for pet in data.get("pet", []):
            pet_dict = {
                "p_name": pet["p_name"],
                "p_type": pet["p_type"],
                "p_color": pet["p_color"],
                "p_age": pet["p_age"]
            }
            pets_data.append(pet_dict)
        result = {
            "_id": str(data["_id"]),
            "u_email": data["u_email"],
            "u_pwd": data["u_pwd"],
            "u_PN": data["u_PN"],
            "u_birth": data["u_birth"],
            "u_sex": data["u_sex"],
            "u_name": data["u_name"],
            "u_nickname": data["u_nickname"],
            "pet": pets_data
        }
        # d_hospital 필드가 있는 경우에만 추가
        if "d_hospital" in data:
            result["d_hospital"] = data["d_hospital"]
        
        return result
    
    elif "po_detail" in data:
        images_data = []
        for image in data.get("im_list", []):
            image_dict = {
                "filename": image["filename"]
            }
            images_data.append(image_dict)
        like_list = []
        for like in data.get("like_list", []):
            like_dict = {
                "user_id": like["user_id"],
                "po_id": like["po_id"]
            }
            like_list.append(like_dict)
        return{
            "po_detail": data["po_detail"],
            "im_ids": images_data,
            "like_list": like_list
        }
    elif "co_detail" in data:
        like_list = []
        for like in data.get("like_list", []):
            like_dict = {
                "user_id": like["user_id"],
                "co_id": like["co_id"]
            }
            like_list.append(like_dict)
        return{
            "co_detail": data["co_detail"],
            "user_id": data["user_id"],
            "post_id": data["post_id"],
            "like_list": like_list
        }
    else:
        raise ValueError("Unsupported type for serialization")

def list_serial(users: List[Union[User]]) -> List[dict]:
    return [individual_serial(user) for user in users]