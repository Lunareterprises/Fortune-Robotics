var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);



module.exports.AddBlogQuery = async ( type, title, category_tags,date, description, highlights, client_name, client_location, imagepath,file_type) => {
    var Query = `insert into blogsNrsearchNothers (bl_type,bl_title,bl_date,bl_category_tags,bl_description,bl_highlights,bl_client_name,bl_client_location,bl_image,bl_file_type) values (?,?,?,?,?,?,?,?,?,?)`;
    var data = query(Query, [ type, title,date,category_tags, description, highlights, client_name, client_location, imagepath,file_type]);
    return data;
};

module.exports.listBlogQuery=async(condition)=>{
  var Query=`SELECT * FROM  blogsNrsearchNothers ${condition}`;
  var data= await query(Query);
  return data;
}

module.exports.RemoveBlog=async(bl_id)=>{
  var Query=`DELETE FROM  blogsNrsearchNothers WHERE bl_id = ?`;
  var data= await query(Query,[bl_id]);
  return data;
}


module.exports.CheckBlogQuery = async (bl_id) => {
    var Query = `select * from blogsNrsearchNothers where bl_id= ?`;
    var data = query(Query, [bl_id]);
    return data;
};

module.exports.ChangeBlog = async (condition, bl_id) => {
    var Query = `update blogsNrsearchNothers ${condition} where bl_id = ?`;
    var data = query(Query, [bl_id]);
    return data;
};
module.exports.Updateimage = async (imagepath, bl_id) => {
    var Query = `update blogsNrsearchNothers set bl_image = ? where bl_id = ? `;
    var data = query(Query, [imagepath, bl_id]);
    return data;
};