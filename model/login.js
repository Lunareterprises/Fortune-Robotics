var db = require("../config/db");
var util =require ("util")
const query = util.promisify(db.query).bind(db)

module.exports.CheckUser=async(email)=>{
    var Query=`select * from user where u_email =?`
    var data =query(Query,[email]);
        return data;
};