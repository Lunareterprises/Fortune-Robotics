var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.AddBannerQuery = async (type,filepath) => {
    var Query = `insert into banner (b_type,b_file) values (?,?) `;
    var data = query(Query, [type,filepath]);
    return data;

}

module.exports.listBannerQuery=async()=>{
  var Query=`SELECT * FROM  banner`;
  var data= await query(Query);
  return data;
}

module.exports.RemoveBanner=async(banner_id)=>{
  var Query=`DELETE FROM  banner WHERE b_id = ?`;
  var data= await query(Query,[banner_id]);
  return data;
}