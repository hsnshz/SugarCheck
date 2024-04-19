import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = (email, code) => {
  try {
    const mailOptions = {
      from: "SugarCheck App <no-reply@sugarcheck.com>",
      to: email,
      subject: "Verification Code for SugarCheck",
      text: `Please verify your email by entering the following code in the app: ${code}`,
      html: `<p>Please verify your email by entering the following code in the app: <b>${code}</b></p>`,
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

const sendPasswordResetEmail = (email, code) => {
  try {
    const mailOptions = {
      from: "SugarCheck App <no-reply@sugarcheck.com>",
      to: email,
      subject: "Password Reset Code for SugarCheck",
      text: `Use the following code to reset your password in the app: ${code}`,
      html: `<p>Use the following code to reset your password in the app: <b>${code}</b></p>`,
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
