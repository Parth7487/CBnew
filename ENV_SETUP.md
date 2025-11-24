# Environment Variables Setup for Vercel

This project uses Node.js API routes that require email configuration through environment variables.

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### Email Configuration

- `MAIL_HOST` - SMTP server host (default: `smtp.gmail.com`)
- `MAIL_PORT` - SMTP server port (default: `587`)
- `MAIL_SENDER_EMAIL` - Your email address for sending emails
- `MAIL_SENDER_PASSWORD` - Your email password or app-specific password
- `MAIL_SENDER_NAME` - Display name for sender (default: `Website Form`)

### Receiver Configuration

- `MAIL_RECEIVER_EMAIL` - Email address to receive form submissions (default: `Sale@cbgloble.in`)
- `MAIL_RECEIVER_NAME` - Display name for receiver (default: `CB GLOBLE INDIA`)

## Gmail Setup

If using Gmail, you'll need to:

1. Enable "Less secure app access" OR
2. Use an App Password:
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password
   - Use the App Password as `MAIL_SENDER_PASSWORD`

## Example Configuration

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SENDER_EMAIL=your-email@gmail.com
MAIL_SENDER_PASSWORD=your-app-password
MAIL_SENDER_NAME=Website Form
MAIL_RECEIVER_EMAIL=Sale@cbgloble.in
MAIL_RECEIVER_NAME=CB GLOBLE INDIA
```

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Select the environments (Production, Preview, Development) where it should be available
5. Redeploy your project

