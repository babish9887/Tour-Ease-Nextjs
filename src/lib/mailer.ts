import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'
import prisma from '../db/dbconfig'


export const sendEmail = async ({ email, emailType, userId }: any) => {
      try {
            // create a hased token
            const hashedToken = await bcryptjs.hash(userId.toString(), 10)
            if (emailType === "VERIFY") {
                  await prisma.user.update({
                        where: {
                              id: userId
                        },
                        data: {
                              verifyToken: hashedToken,
                              verifyTokenExpiry: new Date(Date.now() + 3600000)
                        }
                  });
            } else if (emailType === "RESET") {
                  await prisma.user.update({
                        where: {
                              id: userId
                        },
                        data: {
                              forgotPasswordToken: hashedToken,
                              forgotPasswordTokenExpiry: new Date(Date.now() + 3600000)
                        }
                  });
            }

            const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                  auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                  },
            });


            let message = ""
            if (emailType === 'VERIFY') {
                  message = `<p>Click <a href="https://tourease-babish9887.vercel.app/verifyemail?token=${hashedToken}">here</a> to Verify your Email or copy and paste the link below in your browser. <br> https://tourease-babish9887.vercel.app/verifyemail?token=${hashedToken}
            </p>`
            } else {
                  message = `<p>Click <a href="https://tourease-babish9887.vercel.app/user/login?token=${hashedToken}">here</a> to reset your password or copy and paste the link below in your browser. <br> https://tourease-babish9887.vercel.app/user/login?token=${hashedToken}
            </p>`
            }
            const mailOptions = {
                  from: 'babish@gmail.com',
                  to: email,
                  subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
                  html: message
            }

            const mailresponse = await transporter.sendMail(mailOptions);
            return mailresponse;
      } catch (error: any) {
            throw new Error(error.message);
      }
}