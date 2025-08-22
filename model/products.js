var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// module.exports.checkProduct = async (name) => {
//     var Query = `select * from products where lower(t_name)= ?`;
//     var data = query(Query, [name.toLowerCase()]);
//     return data;
// };

module.exports.AddProductQuery = async (name, rating, short_description, description, price, discount_price, discount, highlights, product_used_places, dimensions, max_speed, battery_life, charging_time, sensors, connectivity, material) => {
    var Query = `insert into products (p_name,p_rating,p_short_descrption,p_descrption,p_price,p_discount_price,p_discount,p_highlights,p_product_used_places,p_dimensions,p_max_speed,p_battery_life,p_charging_time,p_sensors,p_connectivity,p_material) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var data = query(Query, [name, rating, short_description, description, price, discount_price, discount, highlights, product_used_places, dimensions, max_speed, battery_life, charging_time, sensors, connectivity, material]);
    return data;
};

module.exports.AddProductImages=async(product_id,imagePath)=>{
  var Query=`insert into product_images (pi_p_id,pi_image) values(?,?)`;
  var data= await query(Query,[product_id,imagePath]);
  return data;
}

module.exports.AddBrochureFiles = async (p_id,imagePath) => {
    var Query = `update products set p_brochure =? where p_id = ?`;
    var data = query(Query, [imagePath,p_id]);
    return data;
};

module.exports.listProductQuery=async(condition)=>{
  var Query=`SELECT * FROM products ${condition}`;
  var data= await query(Query);
  return data;
}

module.exports.listProductImageQuery=async(p_id)=>{
  var Query=`SELECT * FROM product_images where pi_p_id =?`;
  var data= await query(Query,[p_id]);
  return data;
}

module.exports.RemoveProduct=async(p_id)=>{
  var Query=`DELETE FROM products WHERE p_id = ?`;
  var data= await query(Query,[p_id]);
  return data;
}

module.exports.DeleteFilesQuery=async(p_id, fileKeys)=>{
  var Query=`delete from product_images where pi_p_id=? and pi_id not in (${fileKeys})`;
  var data= await query(Query,[p_id, fileKeys]);
  return data;
}

module.exports.CheckProductQuery = async (p_id) => {
    var Query = `select * from products where p_id= ?`;
    var data = query(Query, [p_id]);
    return data;
};

module.exports.ChangeProduct = async (condition, p_id) => {
    var Query = `update products ${condition} where p_id = ?`;
    var data = query(Query, [p_id]);
    return data;
};
