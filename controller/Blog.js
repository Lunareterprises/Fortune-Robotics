
////BLOG CONTROLLER////CASE STUDY/////RESEARCH//////BEHIND THE SCENES////

var model = require('../model/Blog')
var formidable = require('formidable')
var fs = require('fs')

module.exports.AddBlog = async (req, res) => {
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
            let { type, title, category_tags, description, highlights, client_name, client_location } = fields
            if (!title || !description || !type) {
                return res.send({
                    result: false,
                    messaage: "All fields are required"
                })
            }
            var date = new Date();

            if (files.image) {
                files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                var oldPath = files.image.filepath;
                if (type == 'research') {
                    var newPath =
                        process.cwd() +
                        "/uploads/research/" + files.image.originalFilename
                }
                if (type == 'blog') {
                    var newPath =
                        process.cwd() +
                        "/uploads/blogs/" + files.image.originalFilename
                }
                if (type == 'case_study') {
                    var newPath =
                        process.cwd() +
                        "/uploads/case_study/" + files.image.originalFilename
                }

                if (type == 'behind_the_scenes') {
                    var newPath =
                        process.cwd() +
                        "/uploads/behind_the_scenes/" + files.image.originalFilename
                }
                let file_type = files.image.mimetype.split('/')[0]
                let rawData = fs.readFileSync(oldPath);
                console.log("filet type", files.image.mimetype);

                fs.writeFileSync(newPath, rawData)
                if (type == 'research') {
                    var imagepath = "/uploads/research/" + files.image.originalFilename
                }
                
                if (type == 'blog') {
                    var imagepath = "/uploads/blogs/" + files.image.originalFilename
                }
                if (type == 'case_study') {
                    var imagepath = "/uploads/case_study/" + files.image.originalFilename
                }

                if (type == 'behind_the_scenes') {
                    var imagepath = "/uploads/behind_the_scenes/" + files.image.originalFilename
                }

                //------------------

                if (type == 'research') {
                    var InsertBlog = await model.AddBlogQuery(type, title, category_tags, date, description, highlights, null, null, imagepath, null)
                }
                if (type == 'blog') {
                    var InsertBlog = await model.AddBlogQuery(type, title, null,date, description, null, client_name, client_location, imagepath, null)
                }
                if (type == 'case_study') {
                    var InsertBlog = await model.AddBlogQuery(type, title, category_tags, date, description, null, client_name, client_location, imagepath, null)
                }
                if (type == 'behind_the_scenes') {
                    var InsertBlog = await model.AddBlogQuery(type, title, category_tags, date, description, null, null, null, imagepath, file_type)
                }

                if (InsertBlog.affectedRows) {
                    return res.send({
                        result: true,
                        message: `${type} added sucessfully`
                    })
                } else {
                    return res.send({
                        result: false,
                        message: `failed to add ${type}`
                    })
                }

            } else {
                return res.send({
                    result: false,
                    message: "image is missing"
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

module.exports.listBlog = async (req, res) => {
    try {
        let { type, bl_id } = req.body || {};
        
        let condition = ``;
        if (bl_id) {
            condition = `where bl_id = '${bl_id}' `;
        }
        if (type == 'research') {
            condition = `where bl_type = 'research' `;
        }
        if (type == 'blog') {
            condition = `where bl_type = 'blog' `;
        }
        if (type == 'case_study') {
            condition = `where bl_type = 'case_study' `;
        }
        if (type == 'behind_the_scenes') {
            condition = `where bl_type = 'behind_the_scenes' `;
        }

        let listBlog = await model.listBlogQuery(condition);
        if (listBlog.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                list: listBlog
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


module.exports.DeleteBlog = async (req, res) => {
    try {

        var bl_id = req.body.bl_id;
        let deleteBlog = await model.RemoveBlog(bl_id)

        if (deleteBlog.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Data removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete data"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditBlog = async (req, res) => {
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
            let { bl_id, type, title, category_tags, description, highlights, client_name, client_location } = fields
            if (!bl_id) {
                return res.send({
                    result: false,
                    messaage: "Blog Id is required"
                })
            }
            var checkBlog = await model.CheckBlogQuery(bl_id)
            console.log(checkBlog);

            if (checkBlog.length > 0) {
                console.log(bl_id);

                let condition = ``;

                if (title) {
                    if (condition == '') {
                        condition = `set bl_title ='${title}' `
                    } else {
                        condition += `,bl_title='${title}'`
                    }
                }
                if (category_tags) {
                    if (condition == '') {
                        condition = `set bl_category_tags ='${category_tags}' `
                    } else {
                        condition += `,bl_category_tags='${category_tags}'`
                    }
                }
                if (description) {
                    if (condition == '') {
                        condition = `set bl_description ='${description}' `
                    } else {
                        condition += `,bl_description='${description}'`
                    }
                }
                if (highlights) {
                    if (condition == '') {
                        condition = `set bl_highlights ='${highlights}' `
                    } else {
                        condition += `,bl_highlights='${highlights}'`
                    }
                }
                if (client_name) {
                    if (condition == '') {
                        condition = `set bl_client_name ='${client_name}' `
                    } else {
                        condition += `,bl_client_name='${client_name}'`
                    }
                }
                if (client_location) {
                    if (condition == '') {
                        condition = `set bl_client_location ="${client_location}" `
                    } else {
                        condition += `,bl_client_location="${client_location}"`
                    }
                }


                if (condition !== '') {
                    var EditBlog = await model.ChangeBlog(condition, bl_id)
                }
                if (EditBlog.affectedRows) {


                    if (files.image) {
                        files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                        var oldPath = files.image.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/blogs/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/blogs/" + files.image.originalFilename

                        var InsertBlogimage = await model.Updateimage(imagepath, bl_id)

                    }
                    if (files.image) {
                        files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                        var oldPath = files.image.filepath;
                        if (type == 'research') {
                            var newPath =
                                process.cwd() +
                                "/uploads/research/" + files.image.originalFilename
                        }
                        if (type == 'blog') {
                            var newPath =
                                process.cwd() +
                                "/uploads/blogs/" + files.image.originalFilename
                        }
                        if (type == 'case_study') {
                            var newPath =
                                process.cwd() +
                                "/uploads/case_study/" + files.image.originalFilename
                        }
                        if (type == 'behind_the_scenes') {
                            var newPath =
                                process.cwd() +
                                "/uploads/behind_the_scenes/" + files.image.originalFilename
                        }
                        // let file_type = files.image.mimetype.split('/')[1]
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        if (type == 'research') {
                            var imagepath = "/uploads/research/" + files.image.originalFilename

                        }
                        if (type == 'blog') {
                            var imagepath = "/uploads/blogs/" + files.image.originalFilename
                        }
                        if (type == 'case_study') {
                            var imagepath = "/uploads/case_study/" + files.image.originalFilename
                        }
                        if (type == 'behind_the_scenes') {
                            var imagepath = "/uploads/behind_the_scenes/" + files.image.originalFilename
                        }

                        //------------------
                        var InsertBlogimage = await model.Updateimage(imagepath, bl_id)



                    }
                    return res.send({
                        result: true,
                        message: `${type} updated successfully`
                    })
                } else {
                    return res.send({
                        result: false,
                        message: `failed to update ${type}`
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: `${type} does not exists`
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

