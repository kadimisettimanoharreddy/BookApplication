from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from .database import Base

class Book(Base):
    __tablename__ = "books"
    org_book_id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)