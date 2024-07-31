from pydantic import BaseModel
from typing import List
from models.user import Pet
from models.predict import Predict
    
class Image(BaseModel):
    filename : str
    image_encoded : str
    
    
class UserPostLike(BaseModel):
    user_id : str
    po_id : str
    
    
class UserCommentLike(BaseModel):
    user_id : str
    co_id : str


class Comment(BaseModel):
    co_detail : str
    #user_id : str
    #post_id : str
    like_list : List[UserCommentLike] = []
    
class Post(BaseModel):
    po_detail : str
    image : List[Image] = []
    like_list : List[UserPostLike] = []
    pet : Pet
    