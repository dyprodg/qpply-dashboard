"use client";

import { useEffect, useState } from "react";
import FeedbackMessage from "./FeedbackMessage";
import {
  deleteFeedbackMessage,
  getFeedbackMessages,
  FeedbackItem,
} from "@/lib/actions/feedback";

// Validates if the object has all required properties of a FeedbackItem
function isValidFeedbackItem(item: unknown): item is FeedbackItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as Record<string, unknown>).id === "string" &&
    typeof (item as Record<string, unknown>).email === "string" &&
    typeof (item as Record<string, unknown>).message === "string" &&
    typeof (item as Record<string, unknown>).createdAt === "number" &&
    typeof (item as Record<string, unknown>).userId === "string"
  );
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

      // Validate each item returned from the API
      const validData = data.filter((item) => {
        const valid = isValidFeedbackItem(item);
        if (!valid) {
          console.error("Invalid feedback item format:", item);
        }
        return valid;
      });

      setMessages(validData);
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
      if (!id || !email) {
        throw new Error("Both ID and email are required to delete a message");
      }

      await deleteFeedbackMessage(id, email);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete the message";
      setError(errorMessage);
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
