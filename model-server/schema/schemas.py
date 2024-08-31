from models.user import User
from typing import Union, List

def individual_serial(user: dict) -> dict:
    if "u_email" in user:
        pets_data = []
        for pet in user.get("pet", []):
            pet_dict = {
                "p_name": pet["p_name"],
                "p_type": pet["p_type"],
                "p_color": pet["p_color"],
                "p_age": pet["p_age"]
            }
            pets_data.append(pet_dict)
        return {
            "_id": str(user["_id"]),
            "u_email": user["u_email"],
            "u_pwd": user["u_pwd"],
            "u_PN": user["u_PN"],
            "u_birth": user["u_birth"],
            "u_sex": user["u_sex"],
            "u_name": user["u_name"],
            "u_nickname": user["u_nickname"],
            "pet": pets_data
        }
    else:
        raise ValueError("Unsupported type for serialization")

def list_serial(users: List[Union[User]]) -> List[dict]:
    return [individual_serial(user) for user in users]