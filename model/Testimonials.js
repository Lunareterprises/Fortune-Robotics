var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.checktestimonial = async (name) => {
    var Query = `select * from testimonials where lower(t_name)= ?`;
    var data = query(Query, [name.toLowerCase()]);
    return data;
};

module.exports.AddTestimonialQuery = async (name,company,rating, description, image) => {
    var Query = `insert into testimonials (t_name,t_company,t_rating,t_description,t_image) values (?,?,?,?,?)`;
    var data = query(Query, [name,company,rating, description, image]);
    return data;
};

module.exports.listTestimonialQuery=async()=>{
  var Query=`SELECT * FROM  testimonials`;
  var data= await query(Query);
  return data;
}

module.exports.RemoveTestimonial=async(testimonial_id)=>{
  var Query=`DELETE FROM  testimonials WHERE t_id = ?`;
  var data= await query(Query,[testimonial_id]);
  return data;
}



module.exports.CheckTestimonialQuery = async (t_id) => {
    var Query = `select * from testimonials where t_id= ?`;
    var data = query(Query, [t_id]);
    return data;
};

module.exports.ChangeTestimonial = async (condition, t_id) => {
    var Query = `update testimonials ${condition} where t_id = ?`;
    var data = query(Query, [t_id]);
    return data;
};
module.exports.Updateimage = async (imagepath, t_id) => {
    var Query = `update testimonials set t_image = ? where t_id = ? `;
    var data = query(Query, [imagepath, t_id]);
    return data;
};