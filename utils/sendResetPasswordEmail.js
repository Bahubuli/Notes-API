const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  name,
  email,
  token,
  origin,
}) => {

  const verifyEmail = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on following link : <a href=${verifyEmail}>Reset Password</a> </p>`;
   return sendEmail({
    to: email,
    subject: "Reset password",
    html: `<h4>Hello ${name}


    ${message}

    or copy paste below link in new tab


    ${verifyEmail}

    `,
  });
};

module.exports = sendResetPasswordEmail;
