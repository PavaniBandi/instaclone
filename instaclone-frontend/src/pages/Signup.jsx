import { useState } from 'react';
import { apiRequest } from '../api.jsx';

import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

export default function Signup({ setToken: setAppToken }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiRequest('/auth/signup', 'POST', { email, username, password, fullName });
      localStorage.setItem('token', res.token);
      setAppToken(res.token);
      navigate('/');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl flex bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="hidden md:block w-1/2 bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=500&q=80"
              alt="Instagram mockup"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center p-10">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold font-sans mb-8 tracking-tight">Instagram</span>
              <form onSubmit={handleSubmit} className="w-full flex flex-col">
                {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full mb-2 px-3 py-2 border rounded bg-gray-50 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full mb-2 px-3 py-2 border rounded bg-gray-50 text-sm"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full mb-2 px-3 py-2 border rounded bg-gray-50 text-sm"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full mb-2 px-3 py-2 border rounded bg-gray-50 text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded font-semibold mt-2 mb-3 hover:bg-blue-600">Sign up</button>
                <div className="flex items-center my-3">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="mx-3 text-gray-400 text-xs font-semibold">OR</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <button type="button" className="w-full flex items-center justify-center text-blue-900 font-semibold mb-2" disabled>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.326V1.326C24 .592 23.405 0 22.675 0"/></svg>
                  Sign up with Facebook
                </button>
              </form>
            </div>
            <div className="bg-white border border-gray-200 rounded mt-4 px-10 py-6 w-full max-w-sm text-center mx-auto">
              Have an account?{' '}
              <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 