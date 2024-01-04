const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {

  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
console.log(verifyEmail)
  const message = `<p>Please confirm your email by clicking on the following link : <a href=${verifyEmail}>click here</a> </p>`;
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}
  ${message}

  or copy paste below link in new tab
  ${verifyEmail}
  `
,
  });
};

module.exports = sendVerificationEmail;
