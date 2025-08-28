var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddRentNowQuery = async (product_id, name, email, mobile,quantity,start_date,end_date, purpose,out_sourse,robo_model, message) => {
    var Query = `insert into rent (rn_p_id,rn_name,rn_email,rn_mobile,rn_quantity,rn_start_date,rn_end_date,rn_purpose,rn_out_sourse,rn_robo_model,rn_message) values (?,?,?,?,?,?,?,?,?,?,?)`;
    var data = query(Query, [product_id, name, email, mobile,quantity,start_date,end_date, purpose,out_sourse,robo_model, message]);
    return data;
};

module.exports.listRentNowQuery=async(condition)=>{
  var Query=`SELECT * FROM rent ${condition}`;
  var data= await query(Query);
  return data;
}

module.exports.RemoveRentNow=async(rn_id)=>{
  var Query=`DELETE FROM rent WHERE rn_id = ?`;
  var data= await query(Query,[rn_id]);
  return data;
}


