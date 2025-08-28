var model = require('../model/Quote')

module.exports.AddQuote = async (req, res) => {
    try {

        let { product_id, name, email, mobile, quantity, purpose,customization,customization_details, message } = req.body
        if (!product_id || !name || !email || !mobile || !quantity || !purpose || !message) {
            return res.send({
                result: false,
                messaage: "All fields are required"
            })
        }
        // var checkQuote = await model.checkQuote(name)
        // console.log(checkQuote);
        var InsertQuote = await model.AddQuoteQuery(product_id, name, email, mobile, quantity, purpose,customization,customization_details, message)
        
        if (InsertQuote.affectedRows > 0) {
            return res.send({
                result: false,
                message: "sucessfully add Quote "
            })

        } else {
            return res.send({
                result: false,
                message: "failed to add Quote"
            })

        }


    } catch
    (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

module.exports.listQuote = async (req, res) => {
    try {
        let { q_id } = req.body || {}

        let condition = ''
        if (q_id) {
            condition = `where q_id ='${q_id}'`
        }
        let listQuote = await model.listQuoteQuery(condition);

        if (listQuote.length > 0) {

            return res.send({
                result: true,
                message: "data retrived",
                list: listQuote
            });

        } else {
            return res.send({
                result: false,
                message: "data not found"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message,
        });


    }
}


module.exports.DeleteQuote = async (req, res) => {
    try {

        var q_id = req.body.q_id;

        let deleteQuote = await model.RemoveQuote(q_id)

        if (deleteQuote.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Quote removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Quote"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


