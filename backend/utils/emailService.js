const nodemailer = require('nodemailer');

// Set up the transporter with your email provider details
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send email
const sendReminderEmail = async (email, taskTitle, dueDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Task Reminder - Due Tomorrow',
      text: `Hello, 

This is a reminder that your task "${taskTitle}" is due tomorrow (${dueDate}). Please ensure that you complete the task on time.

Thank you.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendReminderEmail;
