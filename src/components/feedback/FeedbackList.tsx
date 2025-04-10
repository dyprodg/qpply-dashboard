"use client";

import { useEffect, useState } from "react";
import FeedbackMessage from "./FeedbackMessage";
import {
  deleteFeedbackMessage,
  getFeedbackMessages,
} from "@/lib/actions/feedback";

export interface FeedbackItem {
  id: string;
  email: string;
  message: string;
  createdAt: number;
  userId: string;
}

export default function FeedbackList() {
  const [messages, setMessages] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbackMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError("Failed to load feedback messages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    try {
      await deleteFeedbackMessage(id, email);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      setError("Failed to delete the message");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-red-400 p-4 rounded-lg border border-red-800">
        <p>{error}</p>
        <button
          onClick={loadMessages}
          className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-gray-400">No feedback messages found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
          {messages.length} total
        </span>
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <FeedbackMessage
            key={message.id}
            id={message.id}
            email={message.email}
            message={message.message}
            createdAt={message.createdAt}
            userId={message.userId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
