from pydantic import BaseModel
from typing import List

class Comment(BaseModel):
    co_detail : str
    
class Image(BaseModel):
    im_id : str
    
class UserPostLike(BaseModel):
    user_id : str
    po_id : str
    
class UserCommentLike(BaseModel):
    u_id : str
    co_id : str

class Post(BaseModel):
    po_detail : str
    im_ids : List[Image] = []
    commend_list : List[Comment] = []
    like_list : List[UserPostLike] = []
    