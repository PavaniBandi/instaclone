import { useEffect, useState } from 'react';
import { apiRequest } from '../api.jsx';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function Feed({ token, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentingPost, setCommentingPost] = useState(null);
  const [commentText, setCommentText] = useState('');


  useEffect(() => {
    fetchPosts();
  }, [token]);



  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/posts/feed?page=0&size=50', 'GET', null, token);
      setPosts(res.content);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
    setLoading(false);
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await apiRequest(`/posts/${postId}/like`, 'DELETE', null, token);
      } else {
        await apiRequest(`/posts/${postId}/like`, 'POST', null, token);
      }
      // Refresh posts to get updated like status
      fetchPosts();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentClick = (postId) => {
    // Toggle comment input for this post
    if (commentingPost === postId) {
      setCommentingPost(null);
      setCommentText('');
    } else {
      setCommentingPost(postId);
      setCommentText('');
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      await apiRequest(`/posts/${postId}/comments`, 'POST', commentText, token);
      setCommentText('');
      setCommentingPost(null);
      
      // Refresh posts to get updated comment count
      fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };





  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} className="border-b border-gray-100 last:border-b-0">
            {/* Post header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
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
              <button className="text-gray-400 hover:text-gray-600 ml-auto">
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
                  onClick={() => handleLike(post.id, post.isLiked)}
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
                <button 
                  onClick={() => handleCommentClick(post.id)}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
                >
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
              <div className="mb-1">
                <span className="font-semibold mr-2 text-sm">{post.username}</span>
                <span className="text-gray-800 text-sm">{post.caption}</span>
              </div>
              
              {/* Comment count */}
              {post.commentsCount > 0 && (
                <div className="text-gray-500 text-sm">
                  {post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}
                </div>
              )}
              
              {/* Comment input */}
              {commentingPost === post.id && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }}
                  className="flex items-center mt-3 pt-3 border-t border-gray-100"
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border-none outline-none text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`ml-2 text-sm font-semibold ${
                      !commentText.trim()
                        ? 'text-blue-300 cursor-not-allowed'
                        : 'text-blue-500 hover:text-blue-600'
                    }`}
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && !loading && !error && (
          <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Follow some users or create your first post to see content here.</p>
            <button
              onClick={() => window.location.href = '/create'}
              className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
} 