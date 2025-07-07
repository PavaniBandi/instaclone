import { useEffect, useState } from 'react';
import { apiRequest } from '../api.jsx';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Suggestions from '../components/Suggestions.jsx';

export default function PostDetail({ token, onLogout }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchCurrentUser();
    // eslint-disable-next-line
  }, [postId, token]);

  const fetchCurrentUser = async () => {
    try {
      const user = await apiRequest('/users/profile', 'GET', null, token);
      setCurrentUser(user);
    } catch (err) {}
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/posts/${postId}`, 'GET', null, token);
      setPost(res);
    } catch (err) {}
    setLoading(false);
  };

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      if (post.isLiked) {
        await apiRequest(`/posts/${postId}/like`, 'DELETE', null, token);
      } else {
        await apiRequest(`/posts/${postId}/like`, 'POST', null, token);
      }
      fetchPost();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
    setLikeLoading(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await apiRequest(`/posts/${postId}/comments`, 'POST', comment, token);
      setComment('');
      fetchPost();
    } catch (err) {}
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!post) return <div className="text-center mt-10">Post not found</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto">
        <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Post header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center">
              <Link to={`/profile/${post.userId}`}>
                <img
                  src={post.userProfilePicture || `https://i.pravatar.cc/150?u=${post.userId}`}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border object-cover mr-3"
                />
              </Link>
              <Link to={`/profile/${post.userId}`} className="font-semibold hover:underline text-sm">
                {post.username}
              </Link>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
            </button>
          </div>
          {/* Post image */}
          <img src={post.imageUrl} alt="Post" className="w-full object-cover max-h-[400px] bg-gray-100" />
          {/* Post actions and info */}
          <div className="px-4 py-3">
            {/* Action buttons */}
            <div className="flex items-center space-x-4 mb-3">
              <button 
                onClick={handleLike}
                disabled={likeLoading}
                className="flex items-center text-gray-700 hover:text-pink-500 transition-colors"
              >
                {post.isLiked ? (
                  <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <span className="ml-auto text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            
            {/* Like count */}
            {post.likesCount > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-sm">{post.likesCount} like{post.likesCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {/* Caption */}
            <div className="mb-3">
              <span className="font-semibold mr-2 text-sm">{post.username}</span>
              <span className="text-gray-800 text-sm">{post.caption}</span>
            </div>
            <form onSubmit={handleComment} className="flex mb-4">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded px-2 py-1 mr-2"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Post</button>
            </form>
            <div className="max-h-48 overflow-y-auto border-t pt-2">
              {post.comments && post.comments.map(c => (
                <div key={c.id} className="mb-2 flex items-start">
                  <Link to={`/profile/${c.userId}`}>
                    <img
                      src={c.userProfilePicture || `https://i.pravatar.cc/150?u=${c.userId}`}
                      alt="avatar"
                      className="w-7 h-7 rounded-full border object-cover mr-2 mt-1"
                    />
                  </Link>
                  <div>
                    <span className="font-semibold mr-2 text-sm">{c.username}</span>
                    <span className="text-gray-800 text-sm">{c.content}</span>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Suggestions user={currentUser} />
    </div>
  );
} 