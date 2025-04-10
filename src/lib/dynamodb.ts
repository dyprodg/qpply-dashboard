import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient 
} from "@aws-sdk/lib-dynamodb";

// Log environment variables (without sensitive values)
console.log("AWS Region:", process.env.REGION);
console.log("FEEDBACK_TABLE_NAME:", process.env.DYNAMODB_TABLE_NAME_FEEDBACK);

const client = new DynamoDBClient({
  region: process.env.REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

// Configure the DocumentClient to handle conversion between 
// JavaScript objects and DynamoDB's format
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const ddbClient = client;
export const FEEDBACK_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME_FEEDBACK || "qpply-feedback-messages"; 