var db = require("../db/db");
var util =require ("util")
const query = util.promisify(db.query).bind(db)

module.exports.CheckUser=async(email)=>{
    var Query=`select * from users where u_email =?`
    var data =query(Query,[email]);
        return data;
};