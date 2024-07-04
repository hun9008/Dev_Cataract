from models.user import User
from models.doctor import Doctor
from typing import Union, List

# def individual_serial(user):
#     return {
#         "u_id" : str(user["_id"]),
#         "u_email" : user["u_email"],
#         "u_pwd" : user["u_pwd"],
#         "u_PN" : user["u_PN"],
#         "u_birth" : user["u_birth"],
#         "u_sex" : user["u_sex"],
#         "u_name" : user["u_name"],
#         "u_nickname" : user["u_nickname"],
#         "pet" : user["pet"].dict() if user["pet"] else None
#     }

# def list_serial(users):
#     return[individual_serial(user) for user in users]

def individual_serial(user: Union[User, Doctor]) -> dict:
    if isinstance(user, User):
        pets_data = []
        for pet in user.pet:
            pet_dict = {
                "p_name": pet.p_name,
                "p_type": pet.p_type,
                "p_color": pet.p_color,
                "p_age": pet.p_age
            }
            pets_data.append(pet_dict)
        return {
            "u_id": str(user.u_id),
            "u_email": user.u_email,
            "u_pwd": user.u_pwd,
            "u_PN": user.u_PN,
            "u_birth": user.u_birth,
            "u_sex": user.u_sex,
            "u_name": user.u_name,
            "u_nickname": user.u_nickname,
            "pet": pets_data
        }
    elif isinstance(user, Doctor):
        return {
            "d_id": str(user.d_id),
            "d_email": user.d_email,
            "d_pwd": user.d_pwd,
            "d_PN": user.d_PN,
            "d_name": user.d_name,
            "d_nickname": user.d_nickname,
            "d_hospital": user.d_hospital
        }
    else:
        raise ValueError("Unsupported type for serialization")

def list_serial(users: List[Union[User, Doctor]]) -> List[dict]:
    return [individual_serial(user) for user in users]