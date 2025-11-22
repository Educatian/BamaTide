
import React, { useState, useEffect, useRef } from 'react';
import { DiscussionPost, User } from '../types';
import { Send, ThumbsUp } from 'lucide-react';

interface DiscussionBoardProps {
  posts: DiscussionPost[];
  currentUser: User;
  onPost: (content: string) => void;
  variant?: 'sidebar' | 'inline';
  placeholder?: string;
  className?: string;
}

export const DiscussionBoard: React.FC<DiscussionBoardProps> = ({ 
  posts, 
  currentUser, 
  onPost, 
  variant = 'inline',
  placeholder = "Ask a question or share a thought...",
  className = '' 
}) => {
  const [discussionText, setDiscussionText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePostDiscussion = () => {
    if (!discussionText.trim()) return;
    onPost(discussionText);
    setDiscussionText('');
  };

  const handleReply = (userName: string) => {
    setDiscussionText(`@${userName} `);
    inputRef.current?.focus();
  };
  
  // Auto-scroll to bottom on new post if it's the sidebar variant
  useEffect(() => {
      if (variant === 'sidebar' && scrollRef.current) {
          const scrollContainer = scrollRef.current;
          // Simple check if user was already near bottom or if it's initial load
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
  }, [posts.length, variant]);

  const containerClasses = variant === 'sidebar' 
    ? "flex flex-col h-full relative" 
    : "block";
    
  const listClasses = variant === 'sidebar'
    ? "flex-grow overflow-y-auto p-4 space-y-4 pb-20"
    : "space-y-4 mb-6";

  const inputContainerClasses = variant === 'sidebar'
    ? "p-3 border-t border-gray-200 bg-white absolute bottom-0 w-full"
    : "mt-4";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={listClasses} ref={scrollRef}>
        {posts.length === 0 ? (
             <div className="text-center text-gray-400 text-sm py-8 italic">
                No discussion yet. Be the first to post!
             </div>
        ) : (
            <div className="text-xs text-center text-gray-400 my-2 flex items-center justify-center">
                <div className="h-px bg-gray-200 w-12 mr-2"></div>
                <span>Start of Discussion</span>
                <div className="h-px bg-gray-200 w-12 ml-2"></div>
            </div>
        )}

        {posts.map((post) => (
            <div key={post.id} className="flex space-x-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex-shrink-0">
                    {post.userAvatar ? (
                        <img src={post.userAvatar} alt={post.userName} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${post.userRole === 'instructor' ? 'bg-ua-crimson' : 'bg-gray-400'}`}>
                            {post.userName.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex items-baseline justify-between">
                        <span className={`text-sm font-bold ${post.userRole === 'instructor' ? 'text-ua-crimson' : 'text-gray-900'}`}>
                            {post.userName}
                            {post.userRole === 'instructor' && <span className="ml-1 text-[10px] bg-ua-crimson/10 text-ua-crimson px-1 rounded">INSTR</span>}
                        </span>
                        <span className="text-[10px] text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className={`p-3 rounded-lg rounded-tl-none text-sm mt-1 border shadow-sm ${
                        post.userRole === 'instructor' ? 'bg-red-50 border-red-100 text-gray-800' : 'bg-white border-gray-100 text-gray-700'
                    }`}>
                        {post.content}
                    </div>
                    <div className="flex items-center mt-1 space-x-3">
                        <button className="text-xs text-gray-400 hover:text-ua-crimson flex items-center space-x-1 transition-colors">
                            <ThumbsUp size={10} /> <span>{post.likes > 0 ? post.likes : ''}</span>
                        </button>
                        <button 
                            onClick={() => handleReply(post.userName)}
                            className="text-xs text-gray-400 hover:text-ua-crimson font-medium transition-colors"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Post Input */}
      <div className={inputContainerClasses}>
        <div className="relative">
            <textarea 
                ref={inputRef}
                value={discussionText}
                onChange={(e) => setDiscussionText(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-ua-crimson outline-none resize-none h-20 transition-all"
            />
            <button 
                onClick={handlePostDiscussion}
                disabled={!discussionText.trim()}
                className="absolute bottom-2 right-2 p-1.5 bg-ua-crimson text-white rounded hover:bg-red-800 disabled:bg-gray-300 transition-colors"
            >
                <Send size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};
