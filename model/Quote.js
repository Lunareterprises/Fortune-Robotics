var db=require('../config/db');
var util = require('util');
const query = util.promisify(db.query).bind(db);

module.exports.addcontactQuery = async (first_name,last_name, email,phone, message) => {
    var Query = `INSERT INTO contactUs (c_first_name,c_last_name,c_email,c_phone,c_message) VALUES (?,?,?,?,?)`;
    var data= query(Query,[first_name,last_name, email,phone, message]);
    return  data;
};
module.exports.listcontactQuery=async()=>{
     var Query =`select * from contactUs ;`
    var data= await query(Query);
    return data;
}
module.exports.checkcontactQuery =async(c_id)=>{
    var Query= `select * from contactUs where c_id=?`;
    var data =await query(Query,[c_id]);
    return data ;
}
module.exports.removecontactQuery =async(c_id)=>{
    var Query =`delete from contactUs where c_id=?`
    var data =await query (Query,[c_id]);
    return data;
}
