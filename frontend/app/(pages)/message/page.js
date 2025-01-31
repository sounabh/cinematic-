"use client";
import useUserStore from '@/lib/userStore';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatList = () => {
  const { token, user } = useUserStore();
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getChats() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/members/chats`, {
          headers: { authorization: `Bearer ${token}` },
        });
        
        // Process chats to remove duplicates
        const uniqueChats = processChats(response.data.chats);
        setChatData(uniqueChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }
    getChats();
  }, [token]);

  // Function to process chats and remove duplicates
  const processChats = (chats) => {
    const chatMap = new Map();

    chats.forEach(chat => {
      const participants = [chat.senderId._id, chat.receiverId._id].sort().join('_');
      
      // If this combination doesn't exist or if this chat is more recent
      if (!chatMap.has(participants) || 
          new Date(chat.updatedAt) > new Date(chatMap.get(participants).updatedAt)) {
        chatMap.set(participants, chat);
      }
    });

    return Array.from(chatMap.values());
  };

  // Function to get other user's info
  const getOtherUserInfo = (chat) => {
    return chat.senderId._id === user._id ? chat.receiverId : chat.senderId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
              Cinephile Conversations
            </h1>
          </div>
        </div>
      </div>

      {/* Chat Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatData.length > 0 ? (
            chatData.map((chat, ind) => {
              const otherUserInfo = getOtherUserInfo(chat);
              
              return (
                <Link
                  href={`/message/${chat.chatId}`}
                  key={ind}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/20 hover:border-pink-500/40 shadow-lg hover:shadow-purple-500/20">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${otherUserInfo.userImage}`}
                            alt={`${otherUserInfo.username}'s avatar`}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500/50"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-white">
                            {otherUserInfo.username}
                          </h2>
                          <p className="text-purple-300 text-sm mt-1">
                           Connect with your fellow cinephiles
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-black/20 border-t border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-pink-400">Chat now</span>
                        <span className="text-xs text-purple-400">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Conversations Yet</h3>
              <p className="text-purple-300">Start chatting with other cinephiles!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
