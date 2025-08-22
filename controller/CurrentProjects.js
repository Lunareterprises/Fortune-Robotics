var model = require('../model/CurrentProjects')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

module.exports.AddCurrentProject = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            let { name, intro, pre_version, pre_dimension, pre_functionality, New_version, new_dimension, new_functionality, current_progress,process,service,our_robot_include,requirement,feature } = fields
            if (!name || !intro) {
                return res.send({
                    result: false,
                    messaage: "All fields are required"
                })
            }
            // var checkCurrentProject = await model.checkCurrentProject(name)
            // console.log(checkCurrentProject);
            var InsertCurrentProject = await model.AddCurrentProjectQuery(name,intro, pre_version, pre_dimension, pre_functionality, New_version, new_dimension, new_functionality, current_progress,process,service,our_robot_include,requirement,feature)
            if (InsertCurrentProject.affectedRows > 0) {

                let CurrentProject_id = InsertCurrentProject.insertId
                if (files) {

                    // Normalize to array: handles both single and multiple image uploads
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                    const newprojectFiles = Array.isArray(files.newproject) ? files.newproject : [files.newproject];


                    for (const file of imageFiles) {
                        console.log("file :", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const newPath = path.join(process.cwd(), '/uploads/CurrentProjects', file.originalFilename);

                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/CurrentProjects/" + file.originalFilename;

                        var insertImage = await model.AddCurrentProjectImages(CurrentProject_id, imagePath);

                        console.log("Insert result:", insertImage);
                        if (insertImage.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: `failed to insert CurrentProject image ${file.originalFilename}`
                            })
                        }
                    }

                    for (const file of newprojectFiles) {
                        console.log("file :", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const newPath = path.join(process.cwd(), '/uploads/CurrentProjects', file.originalFilename);

                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/CurrentProjects/" + file.originalFilename;

                        var insertnewprojectFiles = await model.AddNewProjectFiles(CurrentProject_id, imagePath);

                        console.log("Insert result:", insertnewprojectFiles);
                        
                        if (insertnewprojectFiles.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: `failed to insert new project file ${file.originalFilename}`
                            })
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Current Project Details Added Successfully',
                    });

                } else {
                    return res.send({
                        result: false,
                        message: "Current Project images are missing"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Current Project"
                })

            }

        })


    } catch
    (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

module.exports.listCurrentProject = async (req, res) => {
    try {
        let { cp_id } = req.body || {}

        let condition = ''
        if (cp_id) {
            condition = `where cp_id ='${cp_id}'`
        }
        let listCurrentProject = await model.listCurrentProjectQuery(condition);

        if (listCurrentProject.length > 0) {
            let getCurrentProjects = await Promise.all(
                listCurrentProject.map(async (el) => {
                    let CurrentProject_id = el.cp_id
                    let CurrentProjectimages = await model.listCurrentProjectImageQuery(CurrentProject_id);
                    el.CurrentProjectimages = CurrentProjectimages
                    return el
                })
            )
            return res.send({
                result: true,
                message: "data retrived",
                list: getCurrentProjects
            });

        } else {
            return res.send({
                result: false,
                message: "data not found"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message,
        });


    }
}


module.exports.DeleteCurrentProject = async (req, res) => {
    try {

        var cp_id = req.body.cp_id;
        let deleteCurrentProject = await model.RemoveCurrentProject(cp_id)

        if (deleteCurrentProject.affectedRows > 0) {
            return res.send({
                result: true,
                message: "CurrentProject removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete CurrentProject"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditCurrentProject = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }

            let { cp_id, name, rating, short_description, description, price, discount_price, discount, highlights, CurrentProject_used_places, dimensions, max_speed, battery_life, charging_time, sensors, connectivity, material } = fields
            console.log("cp_id", cp_id);

            if (!cp_id) {
                return res.send({
                    result: false,
                    messaage: "CurrentProject Id is required"
                })
            }

            var checkCurrentProject = await model.CheckCurrentProjectQuery(cp_id)
            console.log(checkCurrentProject);

            if (checkCurrentProject.length > 0) {
                console.log(cp_id);

                let condition = ``;
                if (name) {
                    if (condition == '') {
                        condition = `SET p_name = "${name}" `;
                    } else {
                        condition += `, p_name = "${name}"`;
                    }
                }
                if (rating) {
                    if (condition == '') {
                        condition = `SET p_rating = "${rating}" `;
                    } else {
                        condition += `, p_rating = "${rating}"`;
                    }
                }
                if (short_description) {
                    if (condition == '') {
                        condition = `SET p_short_descrption = "${short_description}" `;
                    } else {
                        condition += `, p_short_descrption = "${short_description}"`;
                    }
                }
                if (description) {
                    if (condition == '') {
                        condition = `SET p_descrption = "${description}" `;
                    } else {
                        condition += `, p_descrption = "${description}"`;
                    }
                }
                if (price) {
                    if (condition == '') {
                        condition = `SET p_price = "${price}" `;
                    } else {
                        condition += `, p_price = "${price}"`;
                    }
                }
                if (discount_price) {
                    if (condition == '') {
                        condition = `SET p_discount_price = "${discount_price}" `;
                    } else {
                        condition += `, p_discount_price = "${discount_price}"`;
                    }
                }
                if (discount) {
                    if (condition == '') {
                        condition = `SET p_discount = "${discount}" `;
                    } else {
                        condition += `, p_discount = "${discount}"`;
                    }
                }
                if (highlights) {
                    if (condition == '') {
                        condition = `SET p_highlights = "${highlights}" `;
                    } else {
                        condition += `, p_highlights = "${highlights}"`;
                    }
                }
                if (CurrentProject_used_places) {
                    if (condition == '') {
                        condition = `SET p_CurrentProject_used_places = "${CurrentProject_used_places}" `;
                    } else {
                        condition += `, p_CurrentProject_used_places = "${CurrentProject_used_places}"`;
                    }
                }
                if (dimensions) {
                    if (condition == '') {
                        condition = `SET p_dimensions = "${dimensions}" `;
                    } else {
                        condition += `, p_dimensions = "${dimensions}"`;
                    }
                }
                if (max_speed) {
                    if (condition == '') {
                        condition = `SET p_max_speed = "${max_speed}" `;
                    } else {
                        condition += `, p_max_speed = "${max_speed}"`;
                    }
                }
                if (battery_life) {
                    if (condition == '') {
                        condition = `SET p_battery_life = "${battery_life}" `;
                    } else {
                        condition += `, p_battery_life = "${battery_life}"`;
                    }
                }
                if (charging_time) {
                    if (condition == '') {
                        condition = `SET p_charging_time = "${charging_time}" `;
                    } else {
                        condition += `, p_charging_time = "${charging_time}"`;
                    }
                }
                if (sensors) {
                    if (condition == '') {
                        condition = `SET p_sensors = "${sensors}" `;
                    } else {
                        condition += `, p_sensors = "${sensors}"`;
                    }
                }
                if (connectivity) {
                    if (condition == '') {
                        condition = `SET p_connectivity = "${connectivity}" `;
                    } else {
                        condition += `, p_connectivity = "${connectivity}"`;
                    }
                }
                if (material) {
                    if (condition == '') {
                        condition = `SET p_material = "${material}" `;
                    } else {
                        condition += `, p_material = "${material}"`;
                    }
                }


                if (condition !== '') {
                    var EditCurrentProject = await model.ChangeCurrentProject(condition, cp_id)
                }
                if (EditCurrentProject.affectedRows) {

                    if (files) {
                        const fileKeys = Object.keys(files).filter(item => item !== 'image');
                        console.log("fileKeys :", fileKeys);

                        if (fileKeys.length > 0) {
                            await model.DeleteFilesQuery(cp_id, fileKeys);
                        }
                    }

                    if (files.image) {
                        // Normalize to array: handles both single and multiple image uploads
                        const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                        for (const file of imageFiles) {
                            if (!file || !file.filepath || !file.originalFilename) continue;

                            const oldPath = file.filepath;
                            const newPath = path.join(process.cwd(), '/uploads/CurrentProjects', file.originalFilename);

                            const rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);

                            const imagePath = "/uploads/CurrentProjects/" + file.originalFilename;

                            var insertImage = await model.AddCurrentProjectImages(cp_id, imagePath);

                            console.log(" update prodcut image:", insertImage);
                            if (insertImage.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: `failed to insert CurrentProject image ${file.originalFilename}`
                                })
                            }
                        }

                        return res.status(200).json({
                            result: true,
                            message: 'CurrentProject Details Updated Successfully',
                        });

                    }
                    return res.send({
                        result: true,
                        message: "CurrentProject updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update CurrentProject"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "CurrentProject does not exists"
                })
            }
        })

    } catch
    (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

