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
            let { name, intro, pre_version, pre_dimension, pre_functionality, new_version, new_dimension, new_functionality, current_progress, project_process, service, our_robot_include, requirement, feature } = fields
            if (!name || !intro) {
                return res.send({
                    result: false,
                    messaage: "All fields are required"
                })
            }
            // var checkCurrentProject = await model.checkCurrentProject(name)
            // console.log(checkCurrentProject);
            var InsertCurrentProject = await model.AddCurrentProjectQuery(name, intro, pre_version, pre_dimension, pre_functionality, new_version, new_dimension, new_functionality, current_progress, project_process, service, our_robot_include, requirement, feature)
            if (InsertCurrentProject.affectedRows > 0) {

                let CurrentProject_id = InsertCurrentProject.insertId
                if (files) {

                    // Normalize to array: handles both single and multiple image uploads
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                    const newprojectFiles = Array.isArray(files.newproject) ? files.newproject : [files.newproject];


                    for (const file of imageFiles) {
                        console.log("file:", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        // const uploadDir = path.join(process.cwd(), "uploads", "current_projects");
                const uploadDir = path.join(process.cwd(), 'uploads', 'current_projects');

                        // Ensure directory exists
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        const newPath = path.join(uploadDir, file.originalFilename);

                        // Move file
                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/current_projects/" + file.originalFilename;

                        const insertImage = await model.AddCurrentProjectImages(CurrentProject_id, imagePath);
                        console.log("Insert result:", insertImage);

                        if (insertImage.affectedRows === 0) {
                            return res.send({
                                result: false,
                                message: `Failed to insert CurrentProject image ${file.originalFilename}`
                            });
                        }
                    }

                    for (const file of newprojectFiles) {
                        console.log("file:", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const uploadDir = path.join(process.cwd(), "uploads", "current_projects");

                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        const newPath = path.join(uploadDir, file.originalFilename);

                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/current_projects/" + file.originalFilename;

                        const insertNewProjectFile = await model.AddNewProjectFiles(CurrentProject_id, imagePath);
                        console.log("Insert result:", insertNewProjectFile);

                        if (insertNewProjectFile.affectedRows === 0) {
                            return res.send({
                                result: false,
                                message: `Failed to insert new project file ${file.originalFilename}`
                            });
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
            // let getCurrentProjects = await Promise.all(
            //     listCurrentProject.map(async (el) => {
            //         let CurrentProject_id = el.cp_id
            //         let CurrentProjectimages = await model.listCurrentProjectImageQuery(CurrentProject_id);
            //         el.CurrentProjectimages = CurrentProjectimages
            //         return el
            //     })
            // )
            return res.send({
                result: true,
                message: "data retrived",
                list: listCurrentProject
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
                message: "Current Project removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Current Project"
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

            let { cp_id,name, intro, pre_version, pre_dimension, pre_functionality, new_version, new_dimension, new_functionality, current_progress, project_process, service, our_robot_include, requirement, feature } = fields
            // console.log("cp_id", cp_id);

            if (!cp_id) {
                return res.send({
                    result: false,
                    messaage: "Current Project Id is required"
                })
            }

            var checkCurrentProject = await model.CheckCurrentProjectQuery(cp_id)
            console.log(checkCurrentProject);

            if (checkCurrentProject.length > 0) {
                console.log(cp_id);

                let condition = ``;
                if (name) {
                    if (condition == '') {
                        condition = `SET cp_name = "${name}" `;
                    } else {
                        condition += `, cp_name = "${name}"`;
                    }
                }
                if (intro) {
                    if (condition == '') {
                        condition = `SET cp_intro = "${intro}" `;
                    } else {
                        condition += `, cp_intro = "${intro}"`;
                    }
                }
                if (pre_version) {
                    if (condition == '') {
                        condition = `SET cp_pre_version = "${pre_version}" `;
                    } else {
                        condition += `, cp_pre_version = "${pre_version}"`;
                    }
                }
                if (pre_dimension) {
                    if (condition == '') {
                        condition = `SET cp_pre_dimension = "${pre_dimension}" `;
                    } else {
                        condition += `, cp_pre_dimension = "${pre_dimension}"`;
                    }
                }
                if (pre_functionality) {
                    if (condition == '') {
                        condition = `SET cp_pre_functionality = "${pre_functionality}" `;
                    } else {
                        condition += `, cp_pre_functionality = "${pre_functionality}"`;
                    }
                }
                if (new_version) {
                    if (condition == '') {
                        condition = `SET cp_New_version = "${new_version}" `;
                    } else {
                        condition += `, cp_New_version = "${new_version}"`;
                    }
                }
                if (new_dimension) {
                    if (condition == '') {
                        condition = `SET cp_new_dimension = "${new_dimension}" `;
                    } else {
                        condition += `, cp_new_dimension = "${new_dimension}"`;
                    }
                }
                if (new_functionality) {
                    if (condition == '') {
                        condition = `SET cp_new_functionality = "${new_functionality}" `;
                    } else {
                        condition += `, cp_new_functionality = "${new_functionality}"`;
                    }
                }
                if (current_progress) {
                    if (condition == '') {
                        condition = `SET cp_current_progress = "${current_progress}" `;
                    } else {
                        condition += `, cp_current_progress = "${current_progress}"`;
                    }
                }
                if (project_process) {
                    if (condition == '') {
                        condition = `SET cp_process = "${project_process}" `;
                    } else {
                        condition += `, cp_process = "${project_process}"`;
                    }
                }
                if (service) {
                    if (condition == '') {
                        condition = `SET cp_service = "${service}" `;
                    } else {
                        condition += `, cp_service = "${service}"`;
                    }
                }
                if (our_robot_include) {
                    if (condition == '') {
                        condition = `SET cp_our_robot_include = "${our_robot_include}" `;
                    } else {
                        condition += `, cp_our_robot_include = "${our_robot_include}"`;
                    }
                }
                if (requirement) {
                    if (condition == '') {
                        condition = `SET cp_requirement = "${requirement}" `;
                    } else {
                        condition += `, cp_requirement = "${requirement}"`;
                    }
                }
                if (feature) {
                    if (condition == '') {
                        condition = `SET cp_feature = "${feature}" `;
                    } else {
                        condition += `, cp_feature = "${feature}"`;
                    }
                }



                if (condition !== '') {
                    var EditCurrentProject = await model.ChangeCurrentProject(condition, cp_id)
                }
                if (EditCurrentProject.affectedRows > 0) {

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
                            const newPath = path.join(process.cwd(), '/uploads/current_projects', file.originalFilename);

                            const rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);

                            const imagePath = "/uploads/current_projects/" + file.originalFilename;

                            var insertImage = await model.AddCurrentProjectImages(cp_id, imagePath);

                            console.log(" update prodcut image:", insertImage);
                            if (insertImage.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: `failed to insert Current Project image ${file.originalFilename}`
                                })
                            }
                        }

                    }
                    if (files.newproject) {
                        files.newproject = Array.isArray(files.newproject) ? files.newproject[0] : files.newproject;

                        var oldPath = files.newproject.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/current_projects/" + files.newproject.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/current_projects/" + files.newproject.originalFilename

                        var InsertTestimonialimage = await model.AddNewProjectFiles(p_id, imagepath)

                    }
                    return res.send({
                        result: true,
                        message: "Current Project updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Current Project"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Current Project does not exists"
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

