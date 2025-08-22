const model = require('../model/Quote');
var nodemailer = require("nodemailer");

module.exports.AddQuote = async (req, res) => {
    var { full_name, email, phone, purpose_of_use,quantity,message } = req.body;

    if (!full_name || !email || !phone || !purpose_of_use || !quantity) {
        return res.send({
            result: false,
            message: "Please,fill all the fields",
        });
    }
    if (!message) {
        message = "no message"
    }

    let checkQuote = await model.addQuoteQuery(first_name, last_name, email, phone, message)

    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
            type: 'custom',
            method: 'PLAIN',
            // user:"lunarwebtest@lunarsenterprises.com",
            user:process.env.EMAIL,

            // pass:"123abcAB@123",
            pass:process.env.PASSWORD,

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
    <title>Your Quote Request Received</title>
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
            line-height: 1.6;
        }
        .info {
            background-color: #f1f1f1;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .info strong {
            display: inline-block;
            width: 140px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You for Requesting a Quote!</h1>
        <p>Dear ${full_name},</p>
        <p>We have received your quote request with the following details:</p>

        <div class="info">
            <p><strong>Full Name:</strong> ${full_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Purpose of Use:</strong> ${purpose_of_use}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>

        <p>Our team will review your request and get back to you shortly with more details. If you have any urgent questions, feel free to reach out to us directly.</p>

        <div class="footer">
            <p>Thank you!</p>
            <p><strong>FOURTUNE ROBOTICS TEAMS</strong></p>
        </div>
    </div>
</body>
</html>
`
    },
    {
        email:'jaisonlunar701@gmail.com',
        subject:` New Enquiry From : ${full_name}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Quote Us Submission</title>
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
        <h1>New Quote Us Submission</h1>
        <p>You have received a new message from the Quote form from the website.</p>

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
</html>`
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
module.exports.listQuote = async (req, res) => {
    try {

        let listQuote = await model.listQuoteQuery();
        if (listQuote.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listQuote,


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

module.exports.deleteQuote = async (req, res) => {
    try {
        let c_id = req.body.c_id;
        if (c_id) {
            let checkQuote = await model.checkQuoteQuery(c_id);
            if (checkQuote.length == 0) {
                return res.send({
                    result: false,
                    message: "missing Quote us id",

                })


            } else {
                var deletesection = await model.removeQuoteQuery(c_id);
                if (deletesection.affectedRows > 0)
                    return res.send({
                        result: true,
                        message: "Quote deleted successfully"

                    })
            }

        } else {
            return res.send({
                result: false,
                message: "failed to delete Quote",
            })
        }


    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}
