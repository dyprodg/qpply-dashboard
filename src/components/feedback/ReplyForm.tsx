"use client";

import { useState } from "react";
import { sendReplyEmail } from "@/lib/actions/email";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ReplyFormProps {
  email: string;
  message: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReplyForm({
  email,
  message,
  onClose,
  onSuccess,
}: ReplyFormProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await sendReplyEmail(email, message, replyText);
      setStatus(result);

      if (result.success) {
        setReplyText("");
        if (onSuccess) {
          setTimeout(onSuccess, 2000); // Close after showing success message
        }
      }
    } catch (error) {
      setStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while sending the reply",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium">Reply to {email}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 p-1 rounded-full"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
          className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 mb-3 min-h-24 focus:outline-none focus:ring-1 focus:ring-gray-500"
          disabled={isSubmitting}
        />

        {status && (
          <div
            className={`p-2 mb-3 rounded-md ${
              status.success
                ? "bg-green-900 text-green-200"
                : "bg-red-900 text-red-200"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-white hover:bg-gray-200 text-gray-900 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting || !replyText.trim()}
          >
            {isSubmitting ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
