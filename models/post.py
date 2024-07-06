from pydantic import BaseModel
from typing import List
    
class Image(BaseModel):
    filename : str
    
    
class UserPostLike(BaseModel):
    user_id : str
    po_id : str
    
class UserCommentLike(BaseModel):
    u_id : str
    co_id : str


class Comment(BaseModel):
    co_detail : str
    user_id : str
    post_id : str
    
class Post(BaseModel):
    user_id : str
    po_detail : str
    im_ids : List[Image] = []