var db = require("../config/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddCurrentProjectQuery = async (name, intro, pre_version, pre_dimension, pre_functionality, new_version, new_dimension, new_functionality, current_progress, project_process, service, our_robot_include, requirement, feature) => {
    var Query = `INSERT INTO current_projects 
    (cp_name, cp_intro, cp_pre_version, cp_pre_dimension, cp_pre_functionality, cp_New_version, cp_new_dimension, cp_new_functionality, cp_current_progress, cp_process, cp_service, cp_our_robot_include, cp_requirement, cp_feature) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var data = query(Query, [name, intro, pre_version, pre_dimension, pre_functionality, new_version, new_dimension, new_functionality, current_progress, project_process, service, our_robot_include, requirement, feature]);
    return data;
};

module.exports.AddCurrentProjectImages = async (product_id, imagePath) => {
    var Query = `update current_projects set cp_image =? where cp_id = ?`;
    var data = await query(Query, [imagePath,product_id]);
    return data;
}

module.exports.AddNewProjectFiles = async (cp_id, imagePath) => {
    var Query = `update current_projects set cp_new_image =? where cp_id = ?`;
    var data = query(Query, [imagePath, cp_id]);
    return data;
};

module.exports.listCurrentProjectQuery = async (condition) => {
    var Query = `SELECT * FROM current_projects ${condition}`;
    var data = await query(Query);
    return data;
}


module.exports.RemoveCurrentProject = async (cp_id) => {
    var Query = `DELETE FROM current_projects WHERE cp_id = ?`;
    var data = await query(Query, [cp_id]);
    return data;
}

// module.exports.DeleteFilesQuery = async (cp_id, fileKeys) => {
//     var Query = `delete from product_images where pi_cp_id=? and pi_id not in (${fileKeys})`;
//     var data = await query(Query, [cp_id, fileKeys]);
//     return data;
// }

module.exports.CheckCurrentProjectQuery = async (cp_id) => {
    var Query = `select * from current_projects where cp_id= ?`;
    var data = query(Query, [cp_id]);
    return data;
};

module.exports.ChangeCurrentProject = async (condition, cp_id) => {
    var Query = `update current_projects ${condition} where cp_id = ?`;
    var data = query(Query, [cp_id]);
    return data;
};
