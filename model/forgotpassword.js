var db = require("../config/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckEmailQuery = async (email) => {
    var Query = `select * from user where u_email =? `;
    var data = await query(Query, [email]);
    return data;
};

module.exports.UpdatePassword = async (password, email) => {
    var Query = `update user set u_password=? where u_email =?`;
    var data = await query(Query, [password, email]);
    return data;
};

module.exports.StoreResetToken = async (token, expirationDate, u_id) => {
    var Query = `UPDATE user SET u_token = ?, u_token_expiry = ? WHERE u_id = ?`;
    var data = await query(Query, [token, expirationDate, u_id]);
    return data;
};

module.exports.ValidateResetToken = async (email, token) => {
    var Query = `SELECT u_token, u_token_expiry FROM user WHERE u_email = ? AND u_token = ? and u_otp_status="unverified"`;
    var data = await query(Query, [email, token]);
    return data;
};

module.exports.updateOtpStatus = async (email, status) => {
    let Query = `update user set u_otp_status=? where u_email=?`
    return await query(Query, [status, email])
}