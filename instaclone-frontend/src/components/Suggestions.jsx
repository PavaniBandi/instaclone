import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.jsx';

export default function Suggestions({ user, suggestions = [], token }) {
  const [localSuggestions, setLocalSuggestions] = useState(suggestions);

  // Update local suggestions when suggestions change, but preserve local follow/unfollow changes
  useEffect(() => {
    if (suggestions.length > 0) {
      setLocalSuggestions(prevLocal => {
        // If we have existing local suggestions, merge them with new suggestions
        if (prevLocal.length > 0) {
          return suggestions.map(newSuggestion => {
            const existingLocal = prevLocal.find(local => local.id === newSuggestion.id);
            // Keep local follow status if it exists, otherwise use the new suggestion's status
            return existingLocal ? { ...newSuggestion, isFollowed: existingLocal.isFollowed } : newSuggestion;
          });
        }
        // If no existing local suggestions, use the new suggestions as-is
        return suggestions;
      });
    }
  }, [suggestions]);



  return (
    <aside className="hidden lg:block w-1/4 min-w-[280px] pt-8 pr-4">
      <div className="flex items-center mb-6">
        <img src={user?.profilePicture || 'https://i.pravatar.cc/150?u=' + user?.id} alt="avatar" className="w-12 h-12 rounded-full mr-3" />
        <div>
          <div className="font-semibold text-sm">{user?.username || 'User'}</div>
          <div className="text-gray-400 text-xs">Switch</div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm font-semibold">Suggested for you</span>
        <span className="text-xs font-semibold cursor-pointer">See All</span>
      </div>
      <div className="mb-6">
        {localSuggestions.length === 0 && <div className="text-xs text-gray-400">No suggestions</div>}
        {localSuggestions.map(s => (
          <div key={s.id} className="flex items-center mb-3">
            <Link to={`/profile/${s.id}`} className="flex items-center hover:opacity-80 transition-opacity">
              <img src={s.profilePicture || `https://i.pravatar.cc/150?u=${s.id}`} alt={s.username} className="w-8 h-8 rounded-full mr-3" />
              <span className="text-sm font-semibold text-gray-900 hover:text-gray-700">{s.username}</span>
            </Link>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-8">
        About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
        <div className="mt-2">© 2025 INSTAGRAM FROM META</div>
      </div>
    </aside>
  );
} 