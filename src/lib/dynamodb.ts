import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

export const FEEDBACK_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME_FEEDBACK || "qpply-feedback-messages"; 