import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async(emailData)=>{
    try {
        let transporter = nodeMailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:process.env.MAIL_ID,
                pass:process.env.MAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: '"Hey 👻" <info@shouryasinha.com>',
            to:emailData.recipient,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
        });
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
export default sendMail;