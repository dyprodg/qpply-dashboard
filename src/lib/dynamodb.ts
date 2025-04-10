import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Validate AWS credentials are available
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION || "eu-central-1";
const feedbackTableName = process.env.DYNAMODB_TABLE_NAME_FEEDBACK;

// Log environment variables for debugging (without showing full secrets)
console.log("AWS Region:", region);
console.log("FEEDBACK_TABLE_NAME:", feedbackTableName);
console.log("ACCESS_KEY_ID available:", !!accessKeyId);
console.log("SECRET_ACCESS_KEY available:", !!secretAccessKey);

if (!accessKeyId || !secretAccessKey) {
  console.warn("AWS credentials are missing. DynamoDB operations will fail.");
}

if (!feedbackTableName) {
  console.warn("DYNAMODB_TABLE_NAME_FEEDBACK is not set. Using default: qpply-feedback-messages");
}

// Create DynamoDB client with environment variables or defaults
const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
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
export const FEEDBACK_TABLE_NAME = feedbackTableName || "qpply-feedback-messages"; 