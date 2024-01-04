const nodemailer = require("nodemailer");

const sendEmail = async({to,subject,html})=>{

    let config={
        service:"gmail",
        auth:{
            user:"coursedata02@gmail.com",
            pass:"tbtnyfbtjezefxef"
        }
    }

    let transporter = nodemailer.createTransport(config);

    let mail = {
         from:"coursedata02@gmail.com",
         to,subject,html
    }

    await transporter.sendMail(mail);

}

module.exports = sendEmail
