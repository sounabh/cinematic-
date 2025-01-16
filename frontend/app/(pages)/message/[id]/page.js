"use client";

import React, { useEffect, useState } from 'react';
import { Send, Smile, Image, Film, Phone, Video, MoreHorizontal } from 'lucide-react';
import { socketInitialize, sendMessage, receivedMessage } from "@/lib/socket.js";
import { useParams } from 'next/navigation';
import axios from 'axios';
import useUserStore from '@/lib/userStore';

const CinemaChat = () => {
  const params = useParams();
  const { token, user } = useUserStore();
  const userId = user._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [receiver, setReceiver] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const emojis = ['😊', '🎬', '🍿', '⭐', '👍', '❤️', '🎥', '🎭', '🎪', '🎟️'];

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
  };

  useEffect(() => {
    const socket = socketInitialize(params.id, token);
    setIsLoading(true);

    // Handle previous messages from Redis
    receivedMessage("previous-messages", (data) => {
      console.log("Received previous messages:", data);
      setMessages(data.map(msg => ({
        text: msg.message,
        time: new Date(msg.timestamp).toLocaleTimeString(),
        senderId: msg.senderId, // Store sender ID from Redis
        isCurrentUser: msg.senderId === userId // Compare with current user's ID
      })));
      setIsLoading(false);
    });

    // Handle new incoming messages
    receivedMessage("message", (data) => {
      console.log("Received new message:", data);
      setMessages(prev => [...prev, {
        text: data,
        time: new Date().toLocaleTimeString(),
        senderId: data.senderId,
        isCurrentUser: data.senderId === userId
      }]);
    });

    const getReceiverProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/message/${params.id}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
      //  console.log(response);
        
        setReceiver(response.data.receiver);
        setUserImage(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${response.data.sender.userImage}`);
      } catch (error) {
        console.error("Error fetching receiver profile:", error);
      }
    };

    getReceiverProfile();

    return () => {
      if (socket) {
        socket.off("previous-messages");
        socket.off("message");
      }
    };
  }, [params.id, token, userId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setIsSending(true);

    // Add message to local state with current user info
    const messageObj = {
      text: newMessage,
      time: new Date().toLocaleTimeString(),
      senderId: userId,
      isCurrentUser: true
    };

    setMessages(prev => [...prev, messageObj]);

    // Send message to server with sender ID
    sendMessage("chat-message", { 
      newMessage,
      senderId: userId 
    });

    setNewMessage('');
    setIsSending(false);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
 

      {/* Main Chat Area */}
      <div className="flex-1  flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center space-x-3">
            <img 
              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${receiver.userImage}`} 
              alt="Current chat" 
              className="w-10 h-10 rounded-full" 
            />
            <div>
              <h2 className="text-white font-semibold">{receiver.username}</h2>
              <p className="text-purple-300 text-sm">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-purple-300 hover:text-white"><Phone size={20} /></button>
            <button className="text-purple-300 hover:text-white"><Video size={20} /></button>
            <button className="text-purple-300 hover:text-white"><Film size={20} /></button>
            <button className="text-purple-300 hover:text-white"><MoreHorizontal size={20} /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div className=" flex-1 overflow-y-scroll  custom-scrollbar p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-end max-w-[70%] ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  <img 
                    src={message.isCurrentUser ? userImage : `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${receiver.userImage}`}
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full self-end"
                  />
                  <div className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl ${message.isCurrentUser ? 'bg-purple-700 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 p-4 border-t border-purple-800 relative">
          {showEmojis && (
            <div className="absolute bottom-20 bg-gray-800 p-2 rounded-lg border border-purple-800 shadow-lg">
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="hover:bg-gray-700 p-2 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-purple-300 hover:text-white p-2"
            >
              <Smile size={20} />
            </button>
            <button className="text-purple-300 hover:text-white p-2">
              <Image size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-purple-700 hover:bg-purple-600 text-white rounded-full p-2 transition-colors"
              disabled={isSending}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaChat;
