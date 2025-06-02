# backend_python/seed_db.py
import os
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Pet, PetSpecies, PetStatus, PetGender # Import your models
from schemas import PetCreate # Import your PetCreate schema

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Please create a .env file.")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_data():
    db = next(get_db()) # Get a session
    try:
        # Create tables if they don't exist
        print("Creating database tables if they don't exist...")
        Base.metadata.create_all(bind=engine)
        print("Tables created.")

        # Check if pets already exist to avoid duplicates on multiple runs
        if db.query(Pet).count() > 0:
            print("Pets already exist in the database. Skipping seeding.")
            return

        print("Seeding initial pet data...")

        pets_to_add = [
            PetCreate(
                name="Sunny",
                age="2 years",
                species=PetSpecies.dog,
                breed="Golden Retriever",
                description="A very friendly and energetic golden retriever puppy who loves to play fetch.",
                temperament="Playful, Loyal, Affectionate",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.male,
            ),
            PetCreate(
                name="Whiskers",
                age="3 years",
                species=PetSpecies.cat,
                breed="Siamese",
                description="A beautiful Siamese cat with piercing blue eyes, calm and loves cuddles.",
                temperament="Calm, Affectionate, Vocal",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.female,
            ),
            PetCreate(
                name="Buster",
                age="1 year",
                species=PetSpecies.dog,
                breed="Beagle",
                description="A curious and scent-driven Beagle pup, great with kids and other dogs.",
                temperament="Curious, Friendly, Energetic",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.male,
            ),
            PetCreate(
                name="Patches",
                age="4 years",
                species=PetSpecies.cat,
                breed="Ragdoll",
                description="A stunning Ragdoll cat with beautiful blue eyes and a very docile nature.",
                temperament="Gentle, Docile, Affectionate",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.female,
            ),
            PetCreate(
                name="Snowflake",
                age="1.5 years",
                species=PetSpecies.cat,
                breed="Turkish Angora",
                description="A pure white Turkish Angora with mesmerizing blue eyes, very elegant.",
                temperament="Graceful, Playful, Intelligent",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.female,
            ),
             PetCreate(
                name="Rosie",
                age="6 months",
                species=PetSpecies.other, # Assuming rabbit for now, will map to other enum
                breed="Domestic Rabbit",
                description="A fluffy brown rabbit, very curious and loves to hop around.",
                temperament="Curious, Gentle, Active",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.female,
            ),
             PetCreate(
                name="Ozzy",
                age="5 years",
                species=PetSpecies.other, # Using 'other' for bird
                breed="Blue-fronted Amazon",
                description="A vibrant Blue-fronted Amazon parrot, very talkative and enjoys interaction.",
                temperament="Intelligent, Social, Playful",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.male, # Or unknown if bird gender is hard to determine
            ),
            PetCreate(
                name="Ginger",
                age="2 years",
                species=PetSpecies.cat,
                breed="Tabby",
                description="A charming ginger tabby cat, loves exploring outdoors and sunbathing.",
                temperament="Independent, Affectionate, Outdoorsy",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.female,
            ),
            PetCreate(
                name="Leo",
                age="3 years",
                species=PetSpecies.cat,
                breed="Tabby",
                description="A striped tabby cat with striking green eyes, a calm and observant companion.",
                temperament="Calm, Observant, Gentle",
                medical_needs="None",
                status=PetStatus.available,
                gender=PetGender.male,
            ),
        ]

        # Map image names to the pets for easy assignment
        image_map = {
            "Sunny": "Puppy Love Galore_ 15 Cute Ideas to Brighten Your Day.jpeg",
            "Whiskers": "5 Ways To Gain The Trust Of Your Cat.jpeg",
            "Buster": "Top 20 Cutest Dog Breeds in the World (1).jpeg", # Or El Beagle es un perro de origen inglés que se….jpeg
            "Patches": "Ragdoll Cat Colors (10 Types Of Ragdoll Cat Colors And Coat Patterns)_title% - My British Shorthair Cat - Adoption And Cat Guides.jpeg",
            "Snowflake": "e98cd898-356b-41e9-821d-ce7cddcd0199.jpeg",
            "Rosie": "1ec33224-0cd7-474f-927d-1249ccb8bb2b.jpeg",
            "Ozzy": "Blue Fronted Amazon - What You Need To Know About This Pet Bird - PetGuide.jpeg",
            "Ginger": "55 Sweet Cat Names from Movies to Inspire You.jpeg",
            "Leo": "124a99b7-1161-4602-9cee-6c167d3ff191.jpeg",
        }


        for pet_data in pets_to_add:
            image_filename = image_map.get(pet_data.name)
            # Construct the static URL for the image
            image_url = f"http://127.0.0.1:8000/static/images/pets/{image_filename}" if image_filename else None

            db_pet = Pet(
                **pet_data.model_dump(),
                image_url=image_url # Assign the generated URL
            )
            db.add(db_pet)
            db.commit()
            db.refresh(db_pet)
            print(f"Added pet: {db_pet.name} with image: {db_pet.image_url}")

        print("Pet data seeding complete.")

    except Exception as e:
        db.rollback() # Rollback on error
        print(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()