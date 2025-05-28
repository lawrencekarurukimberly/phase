# backend_python/main.py

import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base # Import Base directly here

# Import your database models
from models import Base, User # <--- THIS LINE HAS BEEN CORRECTED

# Load environment variables from .env file (ensure .env is in backend_python/)
load_dotenv()

# --- Database Configuration ---
# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Please create a .env file.")

# Create a SQLAlchemy engine instance
# The 'echo=True' parameter logs all SQL statements, useful for debugging
engine = create_engine(DATABASE_URL, echo=False)

# Create a SessionLocal class to get database sessions
# autocommit=False means you have to explicitly commit transactions
# autoflush=False means objects are not flushed to the database until commit or query
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- FastAPI Application Instance ---
app = FastAPI()

# --- Database Dependency for API Endpoints ---
# This function yields a database session that can be injected into endpoint functions.
def get_db():
    db = SessionLocal()
    try:
        yield db # Provide the session
    finally:
        db.close() # Close the session after the request is done

# --- Database Table Creation on Startup ---
# This event runs once when your FastAPI application starts.
# It creates all tables defined by your Base.metadata in the database.
# In a production environment, you'd typically use dedicated database migration tools (like Alembic).
@app.on_event("startup")
async def startup_event():
    print("Attempting to create database tables...")
    # This will create tables if they don't already exist.
    Base.metadata.create_all(bind=engine)
    print("Database tables creation process completed (tables created if they didn't exist).")


# --- Basic API Endpoints (from your initial setup) ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the PetPals Python Backend!"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello, {name}!"}


# --- Example API Endpoints for User Management (using your User model) ---
# These are commented out. Uncomment them after you've confirmed your
# database connection is working and tables are created.

# from pydantic import BaseModel
# # Pydantic models for request and response validation
# class UserCreate(BaseModel):
#     email: str
#     name: str
#     role: str

# class UserResponse(BaseModel):
#     id: int
#     email: str
#     name: str
#     role: str
#     # This is crucial for Pydantic to read ORM models
#     # For Pydantic v2 (which you have), use from_attributes = True
#     model_config = {
#         "from_attributes": True
#     }


# @app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     """
#     Create a new user in the database.
#     """
#     # Check if user with this email already exists
#     existing_user = db.query(User).filter(User.email == user.email).first()
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="User with this email already exists"
#         )

#     db_user = User(email=user.email, name=user.name, role=user.role)
#     db.add(db_user)
#     db.commit() # Save changes to the database
#     db.refresh(db_user) # Refresh the instance to get the new ID from the database
#     return db_user

# @app.get("/users/{user_id}", response_model=UserResponse)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     """
#     Retrieve a single user by their ID.
#     """
#     user = db.query(User).filter(User.id == user_id).first()
#     if user is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#     return user

# @app.get("/users/", response_model=list[UserResponse])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     """
#     Retrieve a list of users with pagination.
#     """
#     users = db.query(User).offset(skip).limit(limit).all()
#     return users