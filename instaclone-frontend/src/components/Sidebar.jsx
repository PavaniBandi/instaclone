import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75V19a2 2 0 01-2 2H5a2 2 0 01-2-2V9.75z" /></svg>
  ) },
  { name: 'Search', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-2-2" /></svg>
  ) },
  { name: 'Explore', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ) },
  { name: 'Reels', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2" /><path d="M16 3v4M8 3v4M2 11h20" /></svg>
  ) },
  { name: 'Messages', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
  ) },
  { name: 'Notifications', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  ) },
  { name: 'Create', path: '/create', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
  ) },
  { name: 'Profile', path: '/profile/me', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
  ) },
  { name: 'More', path: '#', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
  ) },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="h-screen sticky top-0 flex flex-col items-end pr-4 bg-white border-r border-gray-200 min-w-[220px] w-1/5 justify-between">
      <div className="w-full flex flex-col items-start pt-8">
        <span className="text-3xl font-bold font-sans mb-8 ml-4 tracking-tight">Instagram</span>
        {navItems.map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-2 mb-2 w-full rounded-lg hover:bg-gray-100 transition ${location.pathname === item.path ? 'font-bold text-black' : 'text-gray-700'}`}
            onClick={(e) => {
              // Force refresh if clicking on current page (especially for Home)
              if (location.pathname === item.path && item.name === 'Home') {
                e.preventDefault();
                // Use React Router navigation to refresh the home page
                navigate('/', { replace: true });
              }
            }}
          >
            {item.icon}
            <span className="ml-4 text-base">{item.name}</span>
          </Link>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="w-full bg-red-500 text-white py-2 rounded-b-lg font-semibold hover:bg-red-600 mb-4 mt-4"
      >
        Logout
      </button>
    </aside>
  );
} 