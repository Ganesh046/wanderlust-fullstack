import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import listingService from '../services/listingService';
import { AuthContext } from '../context/AuthContext';
import { Home, Compass, MapPin, Image, ClipboardList, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = [
  { value: 'ROOMS', label: 'Rooms' },
  { value: 'ICONIC_CITIES', label: 'Iconic Cities' },
  { value: 'MOUNTAINS', label: 'Mountains' },
  { value: 'CASTLES', label: 'Castles' },
  { value: 'POOLS', label: 'Amazing Pools' },
  { value: 'CAMPING', label: 'Camping' },
  { value: 'FARMS', label: 'Farms' },
  { value: 'ARCTIC', label: 'Arctic' },
  { value: 'DOMES', label: 'Domes' },
  { value: 'BEACHES', label: 'Beaches' }
];

const ListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    location: '',
    country: '',
    category: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.custom-select-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    // Redirect unauthenticated explorers
    if (!authLoading && !user) {
      toast.error('You must be logged in to access this page!');
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const fetchListing = async () => {
        try {
          const response = await listingService.getListingDetails(id);
          if (response.data) {
            const { title, description, image, price, location, country, category, owner } = response.data;
            
            // Check if current user owns the listing
            if (user && owner.username !== user.username) {
              toast.error('You do not own this stay listing!');
              navigate('/listings');
              return;
            }

            const imgUrl = image?.url || image || '';
            setFormData({ title, description, image: imgUrl, price: price || '', location, country, category: category || '' });
            setImagePreview(imgUrl);
          }
        } catch (err) {
          toast.error('Could not fetch listing details.');
          navigate('/listings');
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, isEditMode, user, authLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side quick checks
    if (!formData.title || !formData.description || !formData.location || !formData.country || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isEditMode && !imageFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) < 0) {
      toast.error('Please enter a valid price greater than or equal to 0.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('country', formData.country);
      data.append('category', formData.category);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditMode) {
        await listingService.updateListing(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Stay details updated successfully!');
        navigate(`/listings/${id}`);
      } else {
        const response = await listingService.createListing(data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data) {
          const newListing = response.data;
          toast.success('Your beautiful stay is now live on Wanderlust!');
          navigate(`/listings/${newListing.id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit stay.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container section-padding" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div style={{
          border: '4px solid rgba(254, 66, 77, 0.1)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '8px'
          }}>
            {isEditMode ? 'Refine Your Stay' : 'List Your Stay'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isEditMode 
              ? 'Update details to keep your homestay attractive to travellers' 
              : 'Share your cozy rooms or luxury villa with the Wanderlust community'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Stay Title *</label>
            <div className="input-wrapper">
              <Home className="input-icon" size={18} />
              <input
                type="text"
                id="title"
                name="title"
                className="form-control form-control-with-icon"
                placeholder="e.g., Cozy Beachside Cottage with Infinite Sunset Views"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Describe what makes your retreat special, the amenities, local attractions..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Image Upload Zone */}
          <div className="form-group">
            <label className="form-label">Stay Cover Image *</label>
            <div className="image-upload-zone">
              <input
                type="file"
                id="image"
                name="image"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
                required={!isEditMode}
              />
              <label htmlFor="image" className={`upload-dropzone ${imagePreview ? 'has-preview' : ''}`}>
                {imagePreview ? (
                  <div className="upload-preview-container">
                    <img src={imagePreview} alt="Stay preview" className="upload-preview-img" />
                    <div className="upload-preview-overlay">
                      <div className="upload-preview-btn">
                        <Image size={16} />
                        <span>Change Stay Image</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-container">
                      <Image size={24} />
                    </div>
                    <p className="upload-title">Choose a beautiful image file</p>
                    <p className="upload-subtitle">Click here to browse your files (PNG, JPG, or JPEG)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Price & Category in 2-column Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price per Night (₹) *</label>
              <div className="input-wrapper">
                <span className="input-icon-text">₹</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control form-control-with-icon"
                  placeholder="e.g., 2500"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <div className="custom-select-container" style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="select-custom-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>
                    {formData.category 
                      ? CATEGORY_OPTIONS.find(opt => opt.value === formData.category)?.label 
                      : 'Select a Category'}
                  </span>
                  <Compass className="input-icon" size={18} />
                  <ChevronDown 
                    className="select-arrow-icon" 
                    size={18} 
                    style={{ 
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>
                
                {/* Hidden input to ensure Joi validation or form checks succeed */}
                <input 
                  type="hidden" 
                  name="category" 
                  value={formData.category} 
                  required 
                />

                {dropdownOpen && (
                  <ul className="custom-select-dropdown">
                    <li 
                      className={`custom-select-option ${formData.category === '' ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: '' }));
                        setDropdownOpen(false);
                      }}
                    >
                      Select a Category
                    </li>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <li
                        key={opt.value}
                        className={`custom-select-option ${formData.category === opt.value ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: opt.value }));
                          setDropdownOpen(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Location & Country in 2-column Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="location">Location / City *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control form-control-with-icon"
                  placeholder="e.g., Jaipur, Rajasthan"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="country">Country *</label>
              <div className="input-wrapper">
                <Compass className="input-icon" size={18} />
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-control form-control-with-icon"
                  placeholder="e.g., India"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
              style={{ flex: 1, padding: '14px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Submitting Stay...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Stay' : 'Publish Stay'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
