const stories = [
  { username: 'alice', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { username: 'bob', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { username: 'charlie', avatar: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { username: 'diana', avatar: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { username: 'eve', avatar: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { username: 'frank', avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
];

export default function StoriesBar() {
  return (
    <div className="flex space-x-4 px-4 py-3 bg-white border-b border-gray-200 rounded-t-lg mb-4 overflow-x-auto">
      {stories.map(story => (
        <div key={story.username} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-pink-500 flex items-center justify-center overflow-hidden mb-1">
            <img src={story.avatar} alt={story.username} className="w-14 h-14 rounded-full object-cover" />
          </div>
          <span className="text-xs text-gray-700 truncate w-16 text-center">{story.username}</span>
        </div>
      ))}
    </div>
  );
} 