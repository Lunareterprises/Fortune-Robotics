var model = require('../model/RentNow')

module.exports.AddRentNow = async (req, res) => {
    try {

        let { product_id, name, email, mobile, quantity, start_date, end_date, purpose,out_sourse,robo_model, message } = req.body
        if (!name || !email || !mobile || !quantity || !start_date  || !end_date || !purpose || !message) {
            return res.send({
                result: false,
                messaage: "All fields are required"
            })
        }
        // var checkRentNow = await model.checkRentNow(name)
        // console.log(checkRentNow);
        var InsertRentNow = await model.AddRentNowQuery(product_id, name, email, mobile, quantity, start_date, end_date, purpose,out_sourse,robo_model, message)
        
        if (InsertRentNow.affectedRows > 0) {
            return res.send({
                result: false,
                message: "sucessfully add RentNow "
            })

        } else {
            return res.send({
                result: false,
                message: "failed to add RentNow"
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

module.exports.listRentNow = async (req, res) => {
    try {
        let { rn_id } = req.body || {}

        let condition = ''
        if (rn_id) {
            condition = `where rn_id ='${rn_id}'`
        }
        let listRentNow = await model.listRentNowQuery(condition);

        if (listRentNow.length > 0) {

            return res.send({
                result: true,
                message: "data retrived",
                list: listRentNow
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


module.exports.DeleteRentNow = async (req, res) => {
    try {

        var rn_id = req.body.rn_id;
        let deleteRentNow = await model.RemoveRentNow(rn_id)

        if (deleteRentNow.affectedRows > 0) {
            return res.send({
                result: true,
                message: "RentNow removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete RentNow"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


