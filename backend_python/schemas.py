from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums (should match models.py, or import directly if in a shared place)
class PetSpecies(str, Enum):
    dog = "Dog"
    cat = "Cat"
    other = "Other"

class PetStatus(str, Enum):
    available = "available"
    pending = "pending"
    adopted = "adopted"

class PetGender(str, Enum):
    male = "Male"
    female = "Female"
    unknown = "Unknown"

# Pet Schemas
class PetCreate(BaseModel):
    name: str = Field(..., min_length=1)
    age: str = Field(..., min_length=1)
    species: PetSpecies
    breed: str = Field(..., min_length=1)
    description: Optional[str] = None
    temperament: Optional[str] = None
    medical_needs: Optional[str] = None
    status: PetStatus = PetStatus.available
    gender: PetGender
    # image_url is not in create, as it will be handled by the backend after upload

    model_config = ConfigDict(use_enum_values=True) # Pydantic V2 syntax for class Config


class PetDisplay(BaseModel):
    id: int
    name: str
    age: str
    species: PetSpecies
    breed: str
    description: Optional[str] = None
    temperament: Optional[str] = None
    medical_needs: Optional[str] = None
    status: PetStatus
    gender: PetGender
    image_url: Optional[str] = None # Added back as it's part of the display model

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 syntax

class ApplicationCreate(BaseModel):
    pet_id: int
    user_id: str # This would typically come from the authenticated user's Firebase UID
    shelter_id: int # This would typically come from the pet's associated shelter
    full_name: str = Field(..., min_length=1)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    phone: str = Field(..., min_length=1)
    address: str = Field(..., min_length=1)
    living_situation: Optional[str] = None
    previous_pet_experience: Optional[str] = None
    why_adopt: str = Field(..., min_length=1)
    home_description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 syntax


class ApplicationDisplay(BaseModel):
    id: int
    pet_id: int
    user_id: str
    shelter_id: int
    full_name: str
    email: str
    phone: str
    address: str
    living_situation: Optional[str] = None
    previous_pet_experience: Optional[str] = None
    why_adopt: str
    home_description: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 syntax

# --- New Message Schemas ---
class MessageCreate(BaseModel):
    sender_id: str
    receiver_id: str
    pet_id: Optional[int] = None # Optional association with a pet
    content: str = Field(..., min_length=1)

    model_config = ConfigDict(from_attributes=True)

class MessageDisplay(BaseModel):
    id: int
    sender_id: str
    receiver_id: str
    pet_id: Optional[int] = None
    content: str
    timestamp: datetime
    is_read: bool

    model_config = ConfigDict(from_attributes=True)

# --- NEW: UserProfile Schemas ---
class UserProfileBase(BaseModel):
    user_id: str # Firebase UID
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    full_name: str
    role: str # e.g., 'adopter', 'shelter'
    preferences: Optional[str] = None # Storing as TEXT or JSON, will need serialization/deserialization
    contact_phone: Optional[str] = None
    address: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass # No additional fields needed for creation beyond base

class UserProfileDisplay(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True) # Enables ORM mode

# --- Owner Schemas (Kept for consistency if 'Owner' model is still used elsewhere, but UserProfile is for Firebase users) ---
class OwnerBase(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    # Removed 'role' from OwnerBase as UserProfile now handles user roles linked to Firebase UID

class OwnerCreate(OwnerBase):
    pass

class OwnerDisplay(OwnerBase):
    id: int
    # firebase_uid: str # Removed, assuming Owner model is for internal linking, not Firebase UID
    model_config = ConfigDict(from_attributes=True)