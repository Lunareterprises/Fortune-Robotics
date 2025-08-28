var model = require('../model/forgotpassword');
var nodemailer = require('nodemailer');
var moment = require('moment')
var bcrypt = require('bcrypt')

module.exports.ForgotPassword = async (req, res) => {
    try {

        var email = req.body.email;

        if (!email) {
            return res.send({
                return: false,
                message: "email is required"
            })
        }
        let checkemail = await model.CheckEmailQuery(email)

        if (checkemail.length > 0) {
            let u_id = checkemail[0]?.u_id
            const otp = Math.floor(1000 + Math.random() * 9000);

            const expirationDate = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

            let storetoken = await model.StoreResetToken(otp, expirationDate, u_id);


            let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 587,
                auth: {
                    type: 'custom',
                    method: 'PLAIN',
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });


            let infos = await transporter.sendMail({
                from: `FOURTUNE ROBOTICS <${process.env.EMAIL}>`,
                to: email,
                subject: "change passoword",
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Change Your Password</h1>
        <p>We received a request to change your password. If you did not request this, please ignore this email.</p>
        <h1>${otp}</h1>
        <p>This is your OTP to change the password</p>
        <p>This OTP will expire in 5 minutes</p>
        <p>Thank you!</p>
    </div>
</body>
</html>

`
            });
            nodemailer.getTestMessageUrl(infos);

            await model.updateOtpStatus(email, "unverified")

            return res.send({
                result: true,
                message: "Password reset email sent "
            })

        } else {
            return res.send({
                result: false,
                message: "email not found"
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}



module.exports.verifyOtp = async (req, res) => {
    try {
        let { email, otp } = req.body
        if (!email || !otp) {
            return res.send({
                result: false,
                message: "email and otp is required"
            })
        }
        let tokenInfo = await model.ValidateResetToken(email, otp);
        console.log(tokenInfo);
        if (tokenInfo.length == 0) {
            return res.send({
                result: false,
                message: "Invalid otp"
            })
        }
        const tokenExpiry = moment(tokenInfo[0].u_token_expiry)

        const date = moment().isAfter(tokenExpiry);

        if (date == true) {
            return res.send({
                result: false,
                message: "Invalid otp"
            })
        } else {
            await model.updateOtpStatus(email, "verified")
            return res.send({
                result: true,
                message: "OTP verified successfully"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        });
    }
}



module.exports.ResetPassword = async (req, res) => {
    try {
        let { email, password } = req.body

        var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed Successfully</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            color: #555;
            line-height: 1.5;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Changed Successfully</h1>
        <p>Dear User,</p>
        <p>Your password has been successfully changed. If you did not make this change, please contact our support team immediately.</p>
       
        <div class="footer">
            <p>Thank you for being a valued user!</p>
            <p>If you have any questions, feel free to reach out to us.</p>
        </div>
    </div>
</body>
</html>
`
        if (!email || !password) {
            return res.send({
                result: false,
                message: "insufficent parameter"
            })
        }
        var hashedpassword = await bcrypt.hash(password, 10)
        let ChangePassword = await model.UpdatePassword(hashedpassword, email);
        if (ChangePassword.affectedRows) {
            let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 587,
                auth: {
                    type: 'custom',
                    method: 'PLAIN',
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            let infos = await transporter.sendMail({
                from: `FOURTUNE ROBOTICS <${process.env.EMAIL}>`,
                to: email,
                subject: "changed password",
                html
            })
            nodemailer.getTestMessageUrl(infos);
            return res.send({
                result: true,
                message: "Password changed successfully",
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to change password"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}