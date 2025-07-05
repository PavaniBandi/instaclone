import { useEffect, useState } from 'react';
import { apiRequest } from '../api.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function Profile({ token, onLogout }) {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', bio: '', profilePicture: '' });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [userId, token]);



  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/users/${userId === 'me' ? 'profile' : userId}`, 'GET', null, token);
      setProfile(res);
      // Check if the profile being viewed belongs to the current user
      const currentUserData = await apiRequest('/users/profile', 'GET', null, token);
      setIsCurrentUser(userId === 'me' || (res && res.id && currentUserData.id === res.id));
      setForm({ fullName: res.fullName || '', bio: res.bio || '', profilePicture: res.profilePicture || '' });
      fetchPosts(res.id);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    setLoading(false);
  };

  const fetchPosts = async (id) => {
    try {
      const res = await apiRequest(`/posts/user/${id}?page=0&size=10`, 'GET', null, token);
      setPosts(res.content || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };



  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await apiRequest('/users/profile', 'PUT', form, token);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleFollow = async () => {
    try {
      await apiRequest(`/users/${profile.id}/follow`, 'POST', null, token);
      fetchProfile();
    } catch (err) {
      console.error('Error following user:', err);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      await apiRequest(`/users/${profile.id}/follow`, 'DELETE', null, token);
      fetchProfile();
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!profile) return <div className="text-center mt-10">Profile not found</div>;

  return (
    <Layout token={token} onLogout={onLogout}>
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-10">
          <img
            src={profile.profilePicture || 'https://i.pravatar.cc/150?u=' + profile.id}
            alt="Profile"
            className="w-32 h-32 rounded-full border object-cover mx-auto md:mx-0 mb-4 md:mb-0"
          />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <span className="text-2xl font-light mr-2">{profile.username}</span>
              {isCurrentUser ? (
                <button onClick={handleEdit} className="bg-white border border-gray-300 text-sm px-4 py-1 rounded font-semibold hover:bg-gray-100 mt-2 md:mt-0">Edit Profile</button>
              ) : profile.isFollowing ? (
                <button onClick={handleUnfollow} className="bg-gray-200 text-sm px-4 py-1 rounded font-semibold hover:bg-gray-300 mt-2 md:mt-0">Unfollow</button>
              ) : (
                <button onClick={handleFollow} className="bg-blue-500 text-white text-sm px-4 py-1 rounded font-semibold hover:bg-blue-600 mt-2 md:mt-0">Follow</button>
              )}
            </div>
            {editing ? (
              <div className="flex flex-col space-y-2 mb-4">
                <input name="fullName" value={form.fullName} onChange={handleChange} className="px-2 py-1 border rounded w-full" placeholder="Full Name" />
                <input name="bio" value={form.bio} onChange={handleChange} className="px-2 py-1 border rounded w-full" placeholder="Bio" />
                <input name="profilePicture" value={form.profilePicture} onChange={handleChange} className="px-2 py-1 border rounded w-full" placeholder="Profile Picture URL" />
                <div className="flex space-x-2">
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Save</button>
                  <button onClick={handleCancel} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg font-semibold mb-1">{profile.fullName}</div>
                <div className="text-gray-700 mb-2">{profile.bio}</div>
              </>
            )}
            <div className="flex space-x-8 mt-2 text-sm">
              <div><span className="font-bold">{profile.postsCount}</span> posts</div>
              <div><span className="font-bold">{profile.followersCount}</span> followers</div>
              <div><span className="font-bold">{profile.followingCount}</span> following</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-4 ml-2">Posts</h3>
        <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          {posts.map(post => (
            <img
              key={post.id}
              src={post.imageUrl}
              alt="Post"
              className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))}
          {posts.length === 0 && <div className="col-span-3 text-center text-gray-400 py-8">No posts yet</div>}
        </div>
      </div>
    </Layout>
  );
} 