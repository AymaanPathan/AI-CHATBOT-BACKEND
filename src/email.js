const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aymaanpathan5@gmail.com",
        pass: "ogcy xfsw hsyr eboa",
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: "ai-bot-p <hello@ai-aymaan.io>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There was an error sending the email");
  }
};

module.exports = sendEmail;
