"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Send, Smile, Image, Film, Phone, Video, MoreHorizontal } from 'lucide-react';
import { socketInitialize, sendMessage, receivedMessage } from "@/lib/socket.js";
import { useParams } from 'next/navigation';
import axios from 'axios';
import useUserStore from '@/lib/userStore';
import Link from 'next/link';

const CinemaChat = () => {
  const params = useParams();
  const { token, user } = useUserStore();
  const userId = user._id;
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const socketInitialized = useRef(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [socketError, setSocketError] = useState(null);

  const emojis = ['😊', '🎬', '🍿', '⭐', '👍', '❤️', '🎥', '🎭', '🎪', '🎟️'];

  // Scroll functionality
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Socket and data initialization
  useEffect(() => {
    let socket = null;
    
    const initializeChat = async () => {
      try {
        // Get receiver profile first
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/message/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
        setReceiver(response.data.receiver);
        setUserImage(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${response.data.sender.userImage}`);

        // Initialize socket after getting profile
        if (!socketInitialized.current) {
          socket = socketInitialize(params.id, token);
          socketInitialized.current = true;

          socket.on('connect', () => {
            console.log('Socket connected successfully');
            setSocketError(null);
          });

          socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setSocketError('Failed to connect to chat server');
            setIsLoading(false);
          });

          // Set up message handlers
          receivedMessage("previous-messages", handlePreviousMessages);
          receivedMessage("message", handleNewMessage);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setSocketError('Failed to load chat');
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.off("previous-messages");
        socket.off("message");
      }
    };
  }, [params.id, token, userId]);

  const handlePreviousMessages = (data) => {
    if (!data) {
      setIsLoading(false);
      return;
    }

    const formattedMessages = data.map((msg) => ({
      text: msg.message || '',
      time: new Date(msg.timestamp).toLocaleTimeString(),
      senderId: msg.senderId,
      isCurrentUser: msg.senderId === userId,
    }));
    
    setMessages(formattedMessages);
    setIsLoading(false);
  };

  const handleNewMessage = (data) => {
    const messageContent = typeof data === 'string' ? data : data.message || '';
    
    setMessages((prev) => [
      ...prev,
      {
        text: messageContent,
        time: new Date().toLocaleTimeString(),
        senderId: data.senderId || userId,
        isCurrentUser: (data.senderId || userId) === userId,
      },
    ]);
    setHasNewMessage(true);
  };

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
  };

  const handleSend = () => {
    if (!newMessage.trim() || socketError) return;
    setIsSending(true);

    sendMessage("chat-message", newMessage);

    setMessages(prev => [...prev, {
      text: newMessage,
      time: new Date().toLocaleTimeString(),
      senderId: userId,
      isCurrentUser: true
    }]);

    setNewMessage('');
    setIsSending(false);
    setHasNewMessage(true);
  };

  // Early return for error state
  if (socketError) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500 mb-4">{socketError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Early return if receiver is not loaded
  if (!receiver) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col max-w-full md:max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 p-3 md:p-4 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Link href={`/profile/${receiver._id}`}>
              <img 
                src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${receiver.userImage}`} 
                alt="Current chat" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
              />
            </Link>
            <div>
              <h2 className="text-white font-semibold text-sm md:text-base">{receiver.username}</h2>
              <p className="text-purple-300 text-xs md:text-sm">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="text-purple-300 hover:text-white p-1 md:p-2"><Phone size={18} className="md:w-5 md:h-5" /></button>
            <button className="text-purple-300 hover:text-white p-1 md:p-2"><Video size={18} className="md:w-5 md:h-5" /></button>
            <button className="text-purple-300 hover:text-white p-1 md:p-2"><Film size={18} className="md:w-5 md:h-5" /></button>
            <button className="text-purple-300 hover:text-white p-1 md:p-2"><MoreHorizontal size={18} className="md:w-5 md:h-5" /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 space-y-3 md:space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-2 md:mb-4`}>
                <div className={`flex items-end max-w-[85%] md:max-w-[70%] ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-1 md:gap-2`}>
                  <img 
                    src={message.isCurrentUser ? userImage : `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${receiver.userImage}`}
                    alt="Avatar" 
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full self-end"
                  />
                  <div className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2 md:p-3 rounded-2xl ${message.isCurrentUser ? 'bg-purple-700 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                      <p className="text-xs md:text-sm break-words">{typeof message.text === 'string' ? message.text : ''}</p>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 mt-1">{message.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 p-3 md:p-4 border-t border-purple-800 relative">
          {showEmojis && (
            <div className="absolute bottom-16 md:bottom-20 left-0 bg-gray-800 p-2 rounded-lg border border-purple-800 shadow-lg">
              <div className="grid grid-cols-5 gap-1 md:gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="hover:bg-gray-700 p-1 md:p-2 rounded text-sm md:text-base"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-purple-300 hover:text-white p-1 md:p-2"
            >
              <Smile size={18} className="md:w-5 md:h-5" />
            </button>
            <button className="text-purple-300 hover:text-white p-1 md:p-2">
              <Image size={18} className="md:w-5 md:h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-900 text-white text-sm md:text-base rounded-full px-3 py-1 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-purple-700 hover:bg-purple-600 text-white rounded-full p-1 md:p-2 transition-colors"
              disabled={isSending}
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaChat;
