import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '../api.jsx';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function CreatePost({ token, onLogout }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest('/users/profile', 'GET', null, token);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) {
      setError('Please select an image');
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result;
        await apiRequest('/posts', 'POST', { caption, imageUrl }, token);
        navigate('/');
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError('Failed to create post');
    }
    setLoading(false);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Create new post</h2>
            <button
              onClick={handleSubmit}
              disabled={loading || !image}
              className={`px-4 py-1 rounded text-sm font-semibold ${
                loading || !image
                  ? 'text-blue-300 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              {loading ? 'Posting...' : 'Share'}
            </button>
          </div>

          {/* Content */}
          <div className="flex">
            {/* Image Upload Section */}
            <div className="flex-1 border-r border-gray-200">
              {!preview ? (
                <div
                  className={`p-8 flex flex-col items-center justify-center min-h-[400px] ${
                    dragActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag photos and videos here</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition"
                    >
                      Select from computer
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-[400px] object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Caption Section */}
            <div className="w-80 flex flex-col">
              {/* User info */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <img
                  src={currentUser?.profilePicture || `https://i.pravatar.cc/150?u=${currentUser?.id || 1}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold text-sm">{currentUser?.username || 'Loading...'}</span>
              </div>

              {/* Caption textarea */}
              <div className="flex-1 p-4">
                <textarea
                  placeholder="Write a caption..."
                  className="w-full border-none resize-none focus:outline-none text-sm"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  rows={8}
                  style={{ minHeight: '200px' }}
                />
              </div>

              {/* Character count */}
              <div className="px-4 pb-4">
                <div className="text-xs text-gray-400 text-right">
                  {caption.length}/2,200
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
    </Layout>
  );
} 