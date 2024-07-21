from pydantic import BaseModel
from typing import List
    
class Image(BaseModel):
    filename : str
    image_id : str
    
    
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

class Predict(BaseModel):
    image : Image
    predicted_class : str
    probability : float
    all_predictions : List[float] = []
    
class Post(BaseModel):
    po_detail : str
    im_list : List[Image] = []
    like_list : List[UserPostLike] = []
    predict : Predict
    