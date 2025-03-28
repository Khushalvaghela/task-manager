
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  if (!to) {
    console.error(" Error: No recipient email provided!");
    return { success: false, message: "No recipient email provided!" };
  }

  console.log(" Sending email to:", to);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error(" Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};

module.exports = sendEmail;
