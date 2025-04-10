'use server';

import { docClient, ddbClient, FEEDBACK_TABLE_NAME } from '@/lib/dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { revalidatePath } from 'next/cache';

export interface FeedbackItem {
  id: string;
  email: string;
  message: string;
  createdAt: number;
  userId: string;
}

// Transforms DynamoDB item format to our application format
function transformDynamoDBItem(item: Record<string, unknown>): FeedbackItem {
  // Handle items that already have the right format
  if (typeof item.id === 'string' && !item.id.S) {
    return {
      id: item.id,
      email: item.email as string,
      message: item.message as string,
      createdAt: item.createdAt as number,
      userId: item.userId as string
    };
  }
  
  // Handle DynamoDB format with S and N types
  const typedItem = item as Record<string, { S?: string; N?: string }>;
  return {
    id: typedItem.id?.S || '',
    email: typedItem.email?.S || '',
    message: typedItem.message?.S || '',
    createdAt: Number(typedItem.createdAt?.N) || 0,
    userId: typedItem.userId?.S || '',
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

    // Check if we have DocumentClient formatted items or raw DynamoDB items
    const firstItem = response.Items[0];
    const isDocumentFormat = firstItem && typeof firstItem.id === 'string';
    
    if (isDocumentFormat) {
      // DocumentClient already converted the items
      return response.Items.map(item => ({
        id: item.id,
        email: item.email,
        message: item.message,
        createdAt: item.createdAt,
        userId: item.userId
      })).sort((a, b) => b.createdAt - a.createdAt);
    } else {
      // Need to transform from DynamoDB format
      return response.Items.map(item => transformDynamoDBItem(item))
        .sort((a, b) => b.createdAt - a.createdAt);
    }
  } catch (error) {
    console.error('Error fetching feedback messages:', error);
    throw new Error('Failed to fetch feedback messages');
  }
}

export async function getFeedbackItem(id: string): Promise<FeedbackItem | null> {
  try {
    // Try to get a specific item to understand the structure
    const command = new ScanCommand({
      TableName: FEEDBACK_TABLE_NAME,
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    });

    const response = await docClient.send(command);
    
    if (!response.Items || response.Items.length === 0) {
      console.log(`Item with id ${id} not found`);
      return null;
    }

    const item = response.Items[0];
    console.log("Raw item from DynamoDB:", JSON.stringify(item, null, 2));
    
    return transformDynamoDBItem(item);
  } catch (error) {
    console.error('Error fetching feedback item:', error);
    return null;
  }
}

export async function deleteFeedbackMessage(id: string, email: string): Promise<void> {
  try {
    // In DynamoDB, we need BOTH the hash key and range key for delete operations
    const params = {
      TableName: FEEDBACK_TABLE_NAME,
      Key: {
        "id": { "S": id },
        "email": { "S": email }
      }
    };
    
    console.log(`Attempting to delete from ${FEEDBACK_TABLE_NAME} with composite key:`, JSON.stringify(params, null, 2));
    
    const result = await ddbClient.send(new DeleteItemCommand(params));
    console.log("Delete success:", result);
    
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting feedback message:', error);
    throw new Error('Failed to delete feedback message');
  }
} 