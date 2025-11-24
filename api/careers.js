const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

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

function createEmailBody(name, phone, email, applyfor, experience, otherdetails) {
  return `
    <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;'>
      <h2 style='color: #002e5f;'>New Career Application</h2>
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
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Apply For:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(applyfor)}</td>
        </tr>
        <tr style='background-color: #e8e8e8;'>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Experience:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(experience)} Years</td>
        </tr>
        <tr>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd; vertical-align: top;'>Additional Details:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>${escapeHtml(otherdetails)}</td>
        </tr>
        <tr style='background-color: #e8e8e8;'>
          <td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Resume:</td>
          <td style='padding: 10px; border: 1px solid #ddd;'>See attached file</td>
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

async function sendEmail(htmlBody, attachmentPath) {
  try {
    const transporter = nodemailer.createTransport(mailConfig);
    
    const mailOptions = {
      from: `"${mailSenderName}" <${mailConfig.auth.user}>`,
      to: `${receiverName} <${receiverEmail}>`,
      subject: 'Someone Contacted You!',
      html: htmlBody,
      text: 'This is a plain-text message body'
    };

    if (attachmentPath && fs.existsSync(attachmentPath)) {
      mailOptions.attachments = [{
        filename: path.basename(attachmentPath),
        path: attachmentPath
      }];
    }
    
    const info = await transporter.sendMail(mailOptions);

    // Clean up uploaded file
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // Clean up uploaded file on error
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }
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
    // Parse form data with file upload
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      keepExtensions: true,
      uploadDir: '/tmp' // Vercel serverless functions use /tmp for temporary files
    });

    const [fields, files] = await form.parse(req);

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const applyfor = Array.isArray(fields.status) ? fields.status[0] : fields.status;
    const experience = Array.isArray(fields.experience) ? fields.experience[0] : fields.experience;
    const otherdetails = Array.isArray(fields.details) ? fields.details[0] : fields.details;

    // Validate required fields
    if (!name || !phone || !email || !applyfor || !experience) {
      res.status(400).send(`
        <center>
          <h1 style="color: #ff6b6b; margin-top: 5rem;">Missing required fields!</h1>
          <p style="font-size: 1.2rem; color: #333;">Please fill in all required fields.</p>
        </center>
      `);
      return;
    }

    // Handle file upload
    let attachmentPath = null;
    const fileToUpload = Array.isArray(files.fileToUpload) ? files.fileToUpload[0] : files.fileToUpload;
    
    if (fileToUpload && fileToUpload.filepath) {
      // Move file to a named location
      const originalName = fileToUpload.originalFilename || 'resume.pdf';
      const extension = path.extname(originalName);
      attachmentPath = path.join('/tmp', `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${extension}`);
      
      try {
        fs.copyFileSync(fileToUpload.filepath, attachmentPath);
        // Remove temporary file created by formidable
        fs.unlinkSync(fileToUpload.filepath);
      } catch (error) {
        console.error('Error handling file upload:', error);
      }
    }

    // Create email body
    const emailBody = createEmailBody(name, phone, email, applyfor, experience, otherdetails || '');

    // Send email
    const result = await sendEmail(emailBody, attachmentPath);

    if (result.success) {
      res.status(200).send(`
        <center>
          <h1 style="color: #00bfff; margin-top: 5rem;">Thank You for Applying!</h1>
          <p style="font-size: 1.2rem; color: #333;">We have received your application and will contact you soon.</p>
        </center>
      `);
    } else {
      res.status(500).send(`
        <center>
          <h1 style="color: #ff6b6b; margin-top: 5rem;">Error sending application!</h1>
          <p style="font-size: 1.2rem; color: #333;">Please try again or contact us at Sale@cbgloble.in or +91 97244 00442</p>
        </center>
      `);
    }
  } catch (error) {
    console.error('Error processing careers form:', error);
    res.status(500).send(`
      <center>
        <h1 style="color: #ff6b6b; margin-top: 5rem;">Error processing request!</h1>
        <p style="font-size: 1.2rem; color: #333;">Please try again later.</p>
      </center>
    `);
  }
};

