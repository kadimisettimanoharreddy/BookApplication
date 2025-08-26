from pydantic import BaseModel, Field
from typing import Optional

class BookCreate(BaseModel):
    org_book_id: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    year: int

class BookOut(BaseModel):
    org_book_id: str
    name: str
    author: str
    year: int

class BookUpdate(BaseModel):
    name: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = None