import { useState, useEffect } from 'react';
import { apiRequest } from '../api.jsx';
import Sidebar from './Sidebar.jsx';
import Suggestions from './Suggestions.jsx';

export default function Layout({ children, token, onLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchCurrentUser();
      await fetchSuggestions();
    };
    fetchAll();
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest('/users/profile', 'GET', null, token);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const allUsers = await apiRequest('/users/search?q=', 'GET', null, token);
      // Get current user data directly instead of relying on state
      const currentUserData = await apiRequest('/users/profile', 'GET', null, token);
      if (!currentUserData) return;
      const followingIds = Array.isArray(currentUserData.following)
        ? currentUserData.following.map(u => (typeof u === 'object' ? u.id : u))
        : [];
      const suggestions = allUsers
        .filter(u => u.id !== currentUserData.id) // Exclude current user
        .filter(u => !followingIds.includes(u.id)) // Exclude already followed users
        .map(u => ({
          ...u,
          isFollowed: false // All remaining users are not followed
        }));
      setSuggestedUsers(suggestions);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestedUsers([]);
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <Sidebar onLogout={onLogout} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8">
        {children}
      </main>
      
      {/* Suggestions Right */}
      <div className="w-80 flex-shrink-0 hidden lg:block pt-8 pr-8">
        <Suggestions
          user={currentUser}
          suggestions={suggestedUsers}
          token={token}
        />
      </div>
    </div>
  );
} 