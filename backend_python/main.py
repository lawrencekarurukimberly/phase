# backend_python/main.py
import os
from dotenv import load_dotenv
from typing import Optional, List
from datetime import datetime

# IMPORTANT: Ensure Header is imported from fastapi and StaticFiles from fastapi.staticfiles
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, APIRouter, Header
from fastapi.staticfiles import StaticFiles # NEW: Import StaticFiles

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import or_

# CORS Middleware
from fastapi.middleware.cors import CORSMiddleware

# Import your database models and schemas
# IMPORTANT: Ensure UserProfile is imported from models
from models import Base, Owner, Pet, PetSpecies, PetStatus, PetGender, Application, Message, UserProfile
# IMPORTANT: Ensure UserProfileCreate and UserProfileDisplay are imported from schemas
from schemas import PetCreate, PetDisplay, ApplicationCreate, ApplicationDisplay, \
                    MessageCreate, MessageDisplay, UserProfileCreate, UserProfileDisplay

# Load environment variables from .env file
load_dotenv()

# --- Database Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Please create a .env file.")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- FastAPI Application Instance ---
app = FastAPI()

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",  # Your React development server (if running on 5173)
    "http://localhost:3000",  # Common React development server port
    "http://127.0.0.1:3000",  # Another common React development server IP/port
    "http://127.0.0.1:5173",  # Just in case for 5173 with IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NEW: Mount Static Files Directory
# Ensure your static files (e.g., images) are in a folder named 'static'
# at the root of your backend project (e.g., backend_python/static/)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the current authenticated user profile
# IMPORTANT: This needs proper Firebase token verification in a real app.
# For debugging, we are temporarily simplifying token verification.
async def get_current_user(
    x_firebase_id_token: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db)
):
    """
    Dependency to get the current authenticated user profile from the database
    by verifying the Firebase ID Token (or a placeholder for now).
    """
    try:
        # Assuming token is "Bearer <id_token>"
        id_token = x_firebase_id_token.replace("Bearer ", "")
        
        # In a real app, you would verify the token with Firebase Admin SDK:
        # from firebase_admin import auth
        # decoded_token = auth.verify_id_token(id_token)
        # user_id = decoded_token['uid']
        
        # FOR LOCAL DEVELOPMENT / TESTING ONLY (TEMPORARY BYPASS):
        # This assumes the token itself is the UID. NOT SECURE FOR PRODUCTION!
        user_id = id_token 

        # Fetch user profile from your database using the user_id
        user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found in backend DB. Please register profile after Firebase login."
            )
        return user_profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}"
        )


api_router = APIRouter(prefix="/api")

# --- Authentication Endpoints ---
@api_router.post("/auth/register-profile", response_model=UserProfileDisplay, status_code=status.HTTP_201_CREATED)
async def register_user_profile(profile_data: UserProfileCreate, db: Session = Depends(get_db)):
    # Check if a user with this user_id or email already exists
    existing_user_by_id = db.query(UserProfile).filter(UserProfile.user_id == profile_data.user_id).first()
    if existing_user_by_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User profile with this Firebase UID already exists."
        )
    existing_user_by_email = db.query(UserProfile).filter(UserProfile.email == profile_data.email).first()
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User profile with this email already exists."
        )

    # Create new profile
    db_profile = UserProfile(**profile_data.model_dump())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@api_router.get("/auth/profile", response_model=UserProfileDisplay)
async def get_user_profile(
    current_user: UserProfileDisplay = Depends(get_current_user), # Dependency
    db: Session = Depends(get_db)
):
    return current_user # Should return the profile fetched by the dependency


# --- Pet Endpoints (add new pets, get pet by ID, etc.) ---
@api_router.post("/pets", response_model=PetDisplay, status_code=status.HTTP_201_CREATED)
async def create_pet(
    name: str = Form(...),
    age: str = Form(...),
    species: PetSpecies = Form(...),
    breed: str = Form(...),
    description: Optional[str] = Form(None),
    temperament: Optional[str] = Form(None),
    medical_needs: Optional[str] = Form(None),
    gender: PetGender = Form(...),
    image: UploadFile = File(...), # Changed from 'photo' to 'image'
    db: Session = Depends(get_db),
    # Requires authentication
    current_user: UserProfileDisplay = Depends(get_current_user)
):
    if current_user.role != 'shelter':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only shelters can add pets.")

    # Save the image file
    UPLOAD_DIRECTORY = "static/images/pets"
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await image.read())

    image_url = f"/static/images/pets/{unique_filename}"

    pet_data = PetCreate(
        name=name,
        age=age,
        species=species,
        breed=breed,
        description=description,
        temperament=temperament,
        medical_needs=medical_needs,
        gender=gender
    )
    db_pet = Pet(**pet_data.model_dump(), owner_id=current_user.id, image_url=image_url) # Assign shelter's ID as owner_id
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

@api_router.get("/pets", response_model=List[PetDisplay])
async def get_pets(
    species: Optional[PetSpecies] = None,
    status: Optional[PetStatus] = None,
    gender: Optional[PetGender] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Pet)
    if species:
        query = query.filter(Pet.species == species)
    if status:
        query = query.filter(Pet.status == status)
    if gender:
        query = query.filter(Pet.gender == gender)
    pets = query.all()
    return pets

@api_router.get("/pets/{pet_id}", response_model=PetDisplay)
async def get_pet_by_id(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet

@api_router.put("/pets/{pet_id}", response_model=PetDisplay)
async def update_pet(
    pet_id: int,
    name: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    species: Optional[PetSpecies] = Form(None),
    breed: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    temperament: Optional[str] = Form(None),
    medical_needs: Optional[str] = Form(None),
    status: Optional[PetStatus] = Form(None),
    gender: Optional[PetGender] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: UserProfileDisplay = Depends(get_current_user) # Authentication required
):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if current_user.role != 'shelter' or pet.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this pet.")

    update_data = {
        k: v for k, v in {
            "name": name, "age": age, "species": species, "breed": breed,
            "description": description, "temperament": temperament,
            "medical_needs": medical_needs, "status": status, "gender": gender
        }.items() if v is not None
    }

    for key, value in update_data.items():
        setattr(pet, key, value)

    if image:
        # Delete old image if it exists
        if pet.image_url:
            old_image_path = os.path.join("static", pet.image_url.replace("/static/", ""))
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
        
        # Save new image
        UPLOAD_DIRECTORY = "static/images/pets"
        os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())
        pet.image_url = f"/static/images/pets/{unique_filename}"

    db.commit()
    db.refresh(pet)
    return pet

@api_router.delete("/pets/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(pet_id: int, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if current_user.role != 'shelter' or pet.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this pet.")
    
    # Delete image file
    if pet.image_url:
        image_path = os.path.join("static", pet.image_url.replace("/static/", ""))
        if os.path.exists(image_path):
            os.remove(image_path)

    db.delete(pet)
    db.commit()
    return {"message": "Pet deleted successfully"}


# --- Application Endpoints ---
@api_router.post("/applications", response_model=ApplicationDisplay, status_code=status.HTTP_201_CREATED)
async def create_application(application_data: ApplicationCreate, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    if current_user.role != 'adopter':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only adopters can submit applications.")
    
    # Check if pet exists
    pet = db.query(Pet).filter(Pet.id == application_data.pet_id).first()
    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found.")
    
    # Add applicant_id from current_user
    db_application = Application(**application_data.model_dump(), applicant_id=current_user.id)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@api_router.get("/applications/user/{user_id}", response_model=List[ApplicationDisplay])
async def get_user_applications(user_id: str, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    # Ensure the user is requesting their own applications or is a shelter admin
    if current_user.user_id != user_id and current_user.role != 'shelter':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view these applications.")
    
    applications = db.query(Application).filter(Application.applicant_id == user_id).all()
    return applications

# --- Message Endpoints ---
@api_router.post("/messages", response_model=MessageDisplay, status_code=status.HTTP_201_CREATED)
async def create_message(message: MessageCreate, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    # A message can be sent by either an adopter or a shelter
    # Ensure sender_id matches current_user.user_id
    if current_user.user_id != message.sender_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sender ID does not match authenticated user.")

    # Optional: Validate receiver_id exists (e.g., is another user profile ID)
    receiver_profile = db.query(UserProfile).filter(UserProfile.user_id == message.receiver_id).first()
    if not receiver_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receiver user not found.")

    db_message = Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@api_router.get("/messages/{message_id}", response_model=MessageDisplay)
async def get_message_by_id(message_id: int, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Ensure current user is either sender or receiver
    if current_user.user_id not in [message.sender_id, message.receiver_id]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this message.")
    
    return message

@api_router.get("/messages/user/{user_id}", response_model=List[MessageDisplay])
async def get_messages_for_user(user_id: str, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    # Ensure user is requesting their own messages
    if current_user.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view messages for this user.")

    messages = db.query(Message).filter(
        or_(Message.sender_id == user_id, Message.receiver_id == user_id)
    ).all()
    return messages

@api_router.put("/messages/{message_id}/read", response_model=MessageDisplay)
async def mark_message_as_read(message_id: int, db: Session = Depends(get_db), current_user: UserProfileDisplay = Depends(get_current_user)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Only the receiver can mark a message as read
    if current_user.user_id != message.receiver_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the receiver can mark this message as read.")

    message.is_read = True
    db.commit()
    db.refresh(message)
    return message


app.include_router(api_router) # IMPORTANT: Ensure this line is present and includes the api_router