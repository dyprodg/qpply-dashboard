'use server';

import { sesClient, SendEmailCommand } from "@/lib/ses";
import { revalidatePath } from "next/cache";

const SES_IDENTITY = "qpply.me";

export async function sendReplyEmail(
  recipientEmail: string, 
  originalMessage: string, 
  replyMessage: string
): Promise<{ success: boolean; message: string }> {
  try {
    const subject = "Your qpply.me Support Ticket";
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #333;">Thanks for contacting us</h2>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #555;">
          <p style="font-weight: bold; margin-top: 0;">Ticket answer:</p>
          <p style="margin-bottom: 0;">${replyMessage}</p>
        </div>
        
        <div style="font-size: 14px; color: #777; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
          <p>Original message: "${originalMessage}"</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
          <p style="font-weight: bold; margin-bottom: 5px;">qpply.me</p>
          <p style="color: #777; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    const textBody = `Thanks for contacting us\n\nTicket answer:\n${replyMessage}\n\nOriginal message: "${originalMessage}"\n\nqpply.me\nThis is an automated response. Please do not reply to this email.`;

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlBody,
          },
          Text: {
            Charset: "UTF-8",
            Data: textBody,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: `support@${SES_IDENTITY}`,
    });

    await sesClient.send(command);
    revalidatePath('/');
    
    return {
      success: true,
      message: "Reply sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send reply",
    };
  }
} 