const nodemailer = require("nodemailer");




// Controller to send email
/****************************************************************************************/
/****************************************************************************************
 * @desc Send email
 * @route POST /api/send-email
 * @access Public
 * @body {to, subject, body, audioUrl}
 * @returns {Object} {message}
 * /****************************************************************************************/
/****************************************************************************************/
const sendEmail = async (req, res) => {
  const { to, subject, body, audioUrl } = req.body;

  try {
    // إعداد الناقل (transporter)
    const transporter = nodemailer.createTransport({
      service: "gmail", // يمكنك تغييره حسب مزود الإيميل
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password", // استخدم App Password إذا كنت على Gmail
      },
    });

    const mailOptions = {
      from: '"Support Team" <your_email@gmail.com>',
      to,
      subject,
      text: `${body}\n\nVoice message: ${audioUrl || "No audio attached"}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/



//export the controller functions
module.exports = { sendEmail };
