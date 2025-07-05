import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import PostDetail from './pages/PostDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import CreatePost from './pages/CreatePost.jsx';
import { getToken, removeToken } from './utils/auth.jsx';

function App() {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    setToken(getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={setToken} />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup setToken={setToken} />} />
        <Route path="/" element={token ? <Feed token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/create" element={token ? <CreatePost token={token} /> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/post/:postId" element={token ? <PostDetail token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 