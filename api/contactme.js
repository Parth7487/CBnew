const nodemailer = require('nodemailer');

// Email configuration from environment variables
const mailConfig = {
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_SENDER_EMAIL || '',
    pass: process.env.MAIL_SENDER_PASSWORD || ''
  }
};

const mailSenderName = process.env.MAIL_SENDER_NAME || 'Website Form';
const receiverEmail = process.env.MAIL_RECEIVER_EMAIL || 'Sale@cbgloble.in';
const receiverName = process.env.MAIL_RECEIVER_NAME || 'CB GLOBLE INDIA';

function createEmailBody(name, phone, email, message) {
  return `
    <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;'>
      <h2 style='color: #002e5f;'>New Contact Form Submission</h2>
      <table style='width: 100%; border-collapse: collapse;'>
        <tr style='background-color: #e8e8e8;'>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Name:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Phone:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(phone)}</td>
        </tr>
        <tr style='background-color: #e8e8e8;'>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Email:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'><a href='mailto:${escapeHtml(email)}'>${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd; vertical-align: top;'>Message:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(message)}</td>
        </tr>
      </table>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function sendEmail(htmlBody) {
  try {
    const transporter = nodemailer.createTransport(mailConfig);
    
    const info = await transporter.sendMail({
      from: `"${mailSenderName}" <${mailConfig.auth.user}>`,
      to: `${receiverName} <${receiverEmail}>`,
      subject: 'Someone Contacted You!',
      html: htmlBody,
      text: 'This is a plain-text message body'
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, phone, email, message } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !message) {
      res.status(400).send(`
        <center>
          <h1 style="color: #ff6b6b; margin-top: 5rem;">Missing required fields!</h1>
          <p style="font-size: 1.2rem; color: #333;">Please fill in all fields.</p>
        </center>
      `);
      return;
    }

    // Create email body
    const emailBody = createEmailBody(name, phone, email, message);

    // Send email
    const result = await sendEmail(emailBody);

    if (result.success) {
      res.status(200).send(`
        <center>
          <h1 style="color: #00bfff; margin-top: 5rem;">Thank You! We will contact you soon.</h1>
          <p style="font-size: 1.2rem; color: #333;">Your message has been received successfully.</p>
        </center>
      `);
    } else {
      res.status(500).send(`
        <center>
          <h1 style="color: #ff6b6b; margin-top: 5rem;">Error sending message!</h1>
          <p style="font-size: 1.2rem; color: #333;">Please try again or contact us at Sale@cbgloble.in or +91 97244 00442</p>
        </center>
      `);
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).send(`
      <center>
        <h1 style="color: #ff6b6b; margin-top: 5rem;">Error processing request!</h1>
        <p style="font-size: 1.2rem; color: #333;">Please try again later.</p>
      </center>
    `);
  }
};

