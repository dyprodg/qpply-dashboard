import { formatDistanceToNow } from "date-fns";
import { TrashIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ReplyForm from "./ReplyForm";

export interface FeedbackMessageProps {
  id: string;
  email: string;
  message: string;
  createdAt: number;
  userId: string;
  onDelete: (id: string, email: string) => void;
}

export default function FeedbackMessage({
  id,
  email,
  message,
  createdAt,
  userId,
  onDelete,
}: FeedbackMessageProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{email}</h3>
          <p className="text-sm text-gray-400">{formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowReplyForm(true)}
            className="text-gray-400 hover:text-blue-400 p-1 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Reply to message"
            disabled={hasReplied}
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(id, email)}
            className="text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Delete message"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-gray-300 whitespace-pre-wrap">{message}</p>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500">ID: {userId.substring(0, 8)}...</p>
      </div>

      {hasReplied && (
        <div className="mt-2 px-3 py-2 bg-gray-800 rounded border-l-2 border-green-500">
          <p className="text-sm text-green-400">Reply sent</p>
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          email={email}
          message={message}
          onClose={() => setShowReplyForm(false)}
          onSuccess={() => {
            setHasReplied(true);
            setShowReplyForm(false);
          }}
        />
      )}
    </div>
  );
}
