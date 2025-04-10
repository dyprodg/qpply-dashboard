'use server';

import { docClient, FEEDBACK_TABLE_NAME } from '@/lib/dynamodb';
import { DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { revalidatePath } from 'next/cache';

interface FeedbackItem {
  id: string;
  email: string;
  message: string;
  createdAt: number;
  userId: string;
}

// Transforms DynamoDB item format to our application format
function transformDynamoDBItem(item: Record<string, any>): FeedbackItem {
  return {
    id: item.id?.S || '',
    email: item.email?.S || '',
    message: item.message?.S || '',
    createdAt: Number(item.createdAt?.N) || 0,
    userId: item.userId?.S || '',
  };
}

export async function getFeedbackMessages(): Promise<FeedbackItem[]> {
  try {
    const command = new ScanCommand({
      TableName: FEEDBACK_TABLE_NAME,
    });

    const response = await docClient.send(command);
    
    if (!response.Items) {
      return [];
    }

    // Transform the items to match our application format
    return response.Items.map(item => {
      return {
        id: item.id,
        email: item.email,
        message: item.message,
        createdAt: item.createdAt,
        userId: item.userId
      };
    }).sort((a, b) => b.createdAt - a.createdAt); // Sort by most recent first
  } catch (error) {
    console.error('Error fetching feedback messages:', error);
    throw new Error('Failed to fetch feedback messages');
  }
}

export async function deleteFeedbackMessage(id: string): Promise<void> {
  try {
    const command = new DeleteCommand({
      TableName: FEEDBACK_TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
    revalidatePath('/'); // Revalidate the dashboard page
  } catch (error) {
    console.error('Error deleting feedback message:', error);
    throw new Error('Failed to delete feedback message');
  }
} 