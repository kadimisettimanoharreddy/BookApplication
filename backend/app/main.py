from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import Base, engine, get_db
from .models import Book
from .schemas import BookCreate, BookOut, BookUpdate
from .config import settings

app = FastAPI(title="Book Keeper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/books", response_model=BookOut, status_code=201)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    book = Book(**payload.model_dump())
    db.add(book)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Book with this org_book_id already exists")
    db.refresh(book)
    return book

@app.get("/books/{org_book_id}", response_model=BookOut)
def get_book(org_book_id: str, db: Session = Depends(get_db)):
    book = db.get(Book, org_book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.delete("/books/{org_book_id}", status_code=204)
def delete_book(org_book_id: str, db: Session = Depends(get_db)):
    book = db.get(Book, org_book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return

@app.patch("/books/{org_book_id}", response_model=BookOut)
def update_book(org_book_id: str, patch: BookUpdate, db: Session = Depends(get_db)):
    book = db.get(Book, org_book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    data = patch.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(book, k, v)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book