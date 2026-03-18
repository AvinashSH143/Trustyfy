import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-password'
  }
});

export const sendOTP = async (email, otp, bookingId) => {
  const mailOptions = {
    from: `"Trustify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Completion OTP for Trustify Booking',
    text: `Your OTP for completing booking #${bookingId} is: ${otp}. Please provide this to your service provider.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Booking Completion OTP</h2>
        <p>Hello,</p>
        <p>Your service provider is ready to finish the job. Please provide them with the following OTP to complete the booking:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; border-radius: 5px; display: inline-block; margin: 10px 0;">
          ${otp}
        </div>
        <p>If you did not request this, please contact support.</p>
        <p>Thanks,<br/>The Trustify Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('--------------------------------');
    console.error('!!! EMAIL SENDING FAILED !!!');
    console.error('Check your EMAIL_USER and EMAIL_PASS in .env');
    console.error('Error Details:', error.message);
    console.error('--------------------------------');
    return false;
  }
};
