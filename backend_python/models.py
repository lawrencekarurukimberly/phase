from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Enum, Boolean
from sqlalchemy.orm import relationship
from database import Base # Import Base from your database.py
import enum
from datetime import datetime

# Define Enums for species, status, and gender
class PetSpecies(enum.Enum):
    dog = "Dog"
    cat = "Cat"
    other = "Other"

class PetStatus(enum.Enum):
    available = "available"
    pending = "pending"
    adopted = "adopted"

class PetGender(enum.Enum):
    male = "Male"
    female = "Female"
    unknown = "Unknown"


class Owner(Base):
    __tablename__ = 'owners'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)

    pets = relationship("Pet", back_populates="owner")
    # Note: No direct relationships to Message here if sender_id/receiver_id are Firebase UIDs (strings)


class Pet(Base):
    __tablename__ = 'pets'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    age = Column(String, nullable=False)
    species = Column(Enum(PetSpecies), nullable=False)
    breed = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    temperament = Column(String, nullable=True)
    medical_needs = Column(String, nullable=True)
    status = Column(Enum(PetStatus), nullable=False, default=PetStatus.available)
    gender = Column(Enum(PetGender), nullable=False)
    image_url = Column(String, nullable=True) # URL to the pet's image

    owner_id = Column(Integer, ForeignKey('owners.id'), nullable=True)
    owner = relationship("Owner", back_populates="pets")

    applications = relationship("Application", back_populates="pet")
    messages = relationship("Message", back_populates="pet_ref")


class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey('pets.id'), nullable=False)
    user_id = Column(String, nullable=False) # Firebase UID of the adopter
    shelter_id = Column(Integer, nullable=False) # ID of the shelter that owns the pet (could be owner.id)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    living_situation = Column(Text, nullable=True)
    previous_pet_experience = Column(Text, nullable=True)
    why_adopt = Column(Text, nullable=False)
    home_description = Column(Text, nullable=True)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

    pet = relationship("Pet", back_populates="applications")


# --- Message Model ---
class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String, nullable=False) # String UID
    receiver_id = Column(String, nullable=False) # String UID
    pet_id = Column(Integer, ForeignKey('pets.id'), nullable=True)
    content = Column(Text, nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    is_read = Column(Boolean, default=False, nullable=False)

    # Relationships
    pet_ref = relationship("Pet", back_populates="messages")

# --- UserProfile Model ---
# This model is for storing user-specific profiles (adopter/shelter) linked to Firebase UIDs.
class UserProfile(Base):
    __tablename__ = 'user_profiles' # Renamed for clarity and to avoid potential clashes

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False) # Firebase UID
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False) # e.g., 'adopter', 'shelter'
    preferences = Column(Text, nullable=True) # Storing as TEXT or JSON, will need serialization/deserialization
    contact_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to applications (optional, if you want to link applications directly to profiles)
    # applications = relationship("Application", back_populates="user_profile")