var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddQuoteQuery = async (product_id, name, email, mobile, quantity, purpose,customization,customization_details, message) => {
    var Query = `insert into quotes (q_name,q_email,q_mobile,q_quantity,q_purpose,q_customization,q_customization_details,q_message) values (?,?,?,?,?,?,?,?)`;
    var data = query(Query, [product_id, name, email, mobile, quantity, purpose,customization,customization_details, message]);
    return data;
};

module.exports.listQuoteQuery=async(condition)=>{
  var Query=`SELECT * FROM quotes ${condition}`;
  var data= await query(Query);
  return data;
}

module.exports.RemoveQuote=async(q_id)=>{
  var Query=`DELETE FROM quotes WHERE q_id = ?`;
  var data= await query(Query,[q_id]);
  return data;
}


