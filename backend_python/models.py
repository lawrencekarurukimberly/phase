from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

# Base class for declarative models. This is fundamental for SQLAlchemy ORM.
Base = declarative_base()

class User(Base):
    """
    Represents a User in the database.
    This will create a table named 'users'.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False) # e.g., 'adopter', 'shelter', 'admin'

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"

# You will define other models here as your project grows, e.g., Pet, AdoptionApplication
# class Pet(Base):
#     __tablename__ = "pets"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     species = Column(String, nullable=False)
#     breed = Column(String)
#     # Add other pet attributes like description, age, etc.
#     # user_id = Column(Integer, ForeignKey("users.id")) # Example if pets are owned by users