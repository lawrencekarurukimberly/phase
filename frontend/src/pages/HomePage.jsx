import React, { useEffect, useState } from 'react';
import { getPets } from '../api/petpalsApi';
import PetCard from '../components/PetCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Modern, real pet images from Unsplash with breed and age
const featuredImages = [
  {
    src: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden Retriever, 2 years old'
  },
  {
    src: 'https://i.pinimg.com/736x/01/ab/4f/01ab4f4921dc27ff2e7dffd905e1f160.jpg',
    alt: 'British Shorthair Kitten, 3 months old'
  },
  {
    src: 'https://i.pinimg.com/736x/0b/92/1f/0b921f0878a6e549b4c31efc29383d1b.jpg',
    alt: 'Border Collie, 1 year old'
  },
  {
    src: 'https://i.pinimg.com/736x/a2/31/3d/a2313d20b982742e4b8731e3774571fb.jpg',
    alt: 'Siamese Kitten, 4 months old'
  },
  {
src: 'https://i.pinimg.com/736x/42/7e/54/427e549668d89c519811fd77a9a6f7f9.jpg',
alt: 'Labrador Retriever Puppy, 5 months old'
  },
  {
    src: 'https://i.pinimg.com/736x/f9/e6/f6/f9e6f671579841ea795e47322c8c1680.jpg',
    alt: 'Tabby Cat, 3 years old'
  },
  {
    src: 'https://i.pinimg.com/736x/a7/59/4d/a7594d1628c92bb6d210b373fcf06303.jpg',
    alt: 'Cockatiel, 1 year old'
  },
  {
    src: 'https://i.pinimg.com/736x/f5/0f/fe/f50ffee2a2a0192b4c673fa4369d58f1.jpg',
    alt: 'Beagle Puppy, 6 months old'
  }
];

function HomePage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError('');
      try {
        let filters = {};
        if (
          userProfile?.role === 'adopter' &&
          userProfile?.preferences?.species &&
          userProfile.preferences.species !== 'all'
        ) {
          filters.species = userProfile.preferences.species;
          if (speciesFilter === 'all') {
            setSpeciesFilter(userProfile.preferences.species);
          }
        } else {
          if (speciesFilter !== 'all') {
            filters.species = speciesFilter;
          }
        }
        const response = await getPets(filters);
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [userProfile, speciesFilter]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80';
    e.target.alt = 'Pet image not available';
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="homepage-bg">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-emoji">🐾</div>
        <h1 className="hero-title">
          Find Your New <span style={{ display: 'block' }}>Best Friend</span> Today!
        </h1>
        <p className="hero-desc">
          Connecting loving homes with adorable pets in need. Every pet deserves a forever home filled with love.
        </p>
        <div className="filter-buttons">
          <Link to="/pets" className="filter-btn">
            Browse Pets
          </Link>
          {userProfile?.role === 'shelter' && (
            <Link to="/add-pet" className="filter-btn">
              List a Pet
            </Link>
          )}
        </div>
      </section>

      {/* Featured Image Gallery Section */}
      <section className="pets-grid-container">
        <div className="text-center mb-16">
          <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Meet Our Adorable Pals
          </h2>
          <p className="home-description">
            Every pet has a unique personality and story. Browse through our gallery of adorable companions waiting for their forever homes.
          </p>
        </div>
        <div className="pets-grid">
          {featuredImages.map((image, index) => (
            <div key={index} className="pet-card-custom">
              <div className="pet-card-img-container">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="pet-card-img"
                  onError={handleImageError}
                />
              </div>
              <div className="pet-card-content">
                <p className="pet-card-desc">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Listing Section */}
      <section className="pets-grid-container">
        <div className="text-center mb-16">
          <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Pets Available For Adoption
          </h2>
          <p className="home-description">
            Find your perfect companion from our loving selection of pets waiting for their forever homes.
          </p>
        </div>
        <div className="filter-buttons" style={{ marginBottom: '2rem' }}>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="filter-btn"
            style={{ minWidth: 200 }}
          >
            <option value="all">All Species</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {loading ? (
          <div className="loader-bg">
            <div className="loader-center">
              <div className="loader-spinner"></div>
              <div className="loader-text">Loading pets...</div>
            </div>
          </div>
        ) : error ? (
          <div className="no-pets-section">
            <div className="no-pets-emoji">😿</div>
            <div className="no-pets-title">{error}</div>
          </div>
        ) : pets.length > 0 ? (
          <div className="pets-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="no-pets-section">
            <div className="no-pets-emoji">😿</div>
            <div className="no-pets-title">No pets found matching your criteria.</div>
            <div className="no-pets-desc">Try adjusting your filters or check back later!</div>
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80"
              alt="Default pet"
              style={{ width: 200, margin: '2rem auto 0', display: 'block', borderRadius: 16 }}
            />
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-emoji">📬</div>
          <h2 className="cta-title">Stay Updated on New Arrivals</h2>
          <p className="cta-desc">
            Be the first to know when new pets arrive at shelters near you. Never miss a chance to meet your new best friend.
          </p>
          {subscribed ? (
            <div className="bg-success" style={{ padding: 24, borderRadius: 16, color: '#fff', marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Thank you for subscribing!</h3>
              <p>You'll receive updates about new pets looking for homes.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="cta-btn-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: 'none',
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                  flex: 1,
                  minWidth: 220,
                }}
              />
              <button type="submit" className="cta-btn">
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;