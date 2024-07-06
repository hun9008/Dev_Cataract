from pydantic import BaseModel
from typing import List

class Pet(BaseModel):
    p_name: str
    p_type: str
    p_color: str
    p_age: str

class User(BaseModel):
    _id: str
    u_email: str
    u_pwd: str
    u_PN: str # Phone Number
    u_birth: str
    u_sex: str
    u_name: str
    u_nickname: str
    pet: List[Pet] = []
