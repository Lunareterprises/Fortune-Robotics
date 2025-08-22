const model = require('../model/contact');
var nodemailer = require("nodemailer");

module.exports.ContactUs = async (req, res) => {
    var { first_name, last_name, email, phone, message } = req.body;

    if (!first_name || !last_name || !email || !phone) {
        return res.send({
            result: false,
            message: "Please,fill all the fields",
        });
    }
    if (!message) {
        message = "no message"
    }

    let checkcontact = await model.addcontactQuery(first_name, last_name, email, phone, message)

    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
            type: 'custom',
            method: 'PLAIN',
            user:"lunarwebtest@lunarsenterprises.com",
            pass:"123abcAB@123",
        },
    });

    let data = [{
        email:email,
        subject: "MESSAGE FROM FOURTUNE ROBOTICS",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us </title>
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
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You for Contacting Us!</h1>
        <p>Dear ${first_name} ${last_name},</p>
        <p>We appreciate your message and will get back to you as soon as possible. Your feedback is important to us!</p>
    
        <div class="footer">
            <p>Thank you!</p>
            <p>FOURTUNE ROBOTICS TEAMS</p>
        </div>
    </div>
</body>
</html>

`
    },
    {
        email:'jaisonlunar701@gmail.com',
        subject:` New Enquiry From : ${first_name} ${last_name}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Us Submission</title>
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
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
        .highlight {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Contact Us Submission</h1>
        <p>You have received a new message from the contact form from the website.</p>

        <h2>User Details:</h2>
        <div class="highlight">
            <p><strong>Name:</strong> ${first_name} ${last_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        </div>

        <div class="footer">
            <p>Thank you for your attention!</p>
            <p>FOURTUNE ROBOTICS TEAMS</p>
        </div>
    </div>
</body>
</html>
`
    }]


    data.forEach(async (el) => {
        let infos = await transporter.sendMail({
            from: `FOURTUNE ROBOTICS<${process.env.EMAIL}>`,
            to: el.email,
            subject: el.subject,
            html: el.html
        });
        nodemailer.getTestMessageUrl(infos);

    });


    return res.send({
        status: true,
        message: "mail sent",
    });
};

module.exports.listcontact = async (req, res) => {
    try {

        let listcontact = await model.listcontactQuery();
        if (listcontact.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listcontact,


            });

        } else {
            return res.send({
                result: false,
                messsage: "data not found",
            });
        }


    } catch (error) {
        return res.send({
            reult: false,
            message: error.message,
        });

    }
}

module.exports.deletecontact = async (req, res) => {
    try {
        let c_id = req.body.c_id;
        if (c_id) {
            let checkcontact = await model.checkcontactQuery(c_id);
            if (checkcontact.length == 0) {
                return res.send({
                    result: false,
                    message: "missing contact us id",

                })


            } else {
                var deletesection = await model.removecontactQuery(c_id);
                if (deletesection.affectedRows > 0)
                    return res.send({
                        result: true,
                        message: "contact deleted successfully"
                    })
            }

        } else {
            return res.send({
                result: false,
                message: "failed to delete contact",
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}
