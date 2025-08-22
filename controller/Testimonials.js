var model = require('../model/Testimonials')
var formidable = require('formidable')
var fs = require('fs')

module.exports.AddaddTestimonial = async (req, res) => {
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
            let { name, company, rating, description } = fields
            if (!name || !description || !company || !rating) {
                return res.send({
                    result: false,
                    messaage: "All fields are required"
                })
            }

            if (files.image) {
                files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() +
                    "/uploads/testimonials/" + files.image.originalFilename
                let rawData = fs.readFileSync(oldPath);
                console.log(oldPath);

                fs.writeFileSync(newPath, rawData)
                var image = "/uploads/testimonials/" + files.image.originalFilename

                var InsertteamMember = await model.AddTestimonialQuery(name, company, rating, description, image)
                if (InsertteamMember.affectedRows) {
                    return res.send({
                        result: true,
                        message: "Testimonial added"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to add testimonial"
                    })
                }

            } else {
                return res.send({
                    result: false,
                    message: "image missing"
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

module.exports.listTestimonial = async (req, res) => {
    try {

        let listTestimonial = await model.listTestimonialQuery();
        if (listTestimonial.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                list: listTestimonial
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


module.exports.DeleteTestimonial = async (req, res) => {
    try {

        var testimonial_id = req.body.testimonial_id;
        let deleteTestimonial = await model.RemoveTestimonial(testimonial_id)

        if (deleteTestimonial.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Testimonial removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Testimonial"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditTestimonial = async (req, res) => {
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
            let { t_id, name, company, rating, description } = fields
            if (!t_id) {
                return res.send({
                    result: false,
                    messaage: "Testimonial Id is required"
                })
            }
            var checkTestimonial = await model.CheckTestimonialQuery(t_id)
            console.log(checkTestimonial);

            if (checkTestimonial.length > 0) {
                console.log(t_id);

                let condition = ``;

                if (name) {
                    if (condition == '') {
                        condition = `set t_name ='${name}' `
                    } else {
                        condition += `,t_name='${name}'`
                    }
                }
                if (company) {
                    if (condition == '') {
                        condition = `set t_company ='${company}' `
                    } else {
                        condition += `,t_company='${company}'`
                    }
                }
                if (rating) {
                    if (condition == '') {
                        condition = `set t_rating ='${rating}' `
                    } else {
                        condition += `,t_rating='${rating}'`
                    }
                }
                if (description) {
                    if (condition == '') {
                        condition = `set t_description ="${description}" `
                    } else {
                        condition += `,t_description="${description}"`
                    }
                }


                if (condition !== '') {
                    var EditTestimonial = await model.ChangeTestimonial(condition, t_id)
                }
                if (EditTestimonial.affectedRows) {


                    if (files.image) {
                        files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                        var oldPath = files.image.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/testimonials/" + files.image.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/testimonials/" + files.image.originalFilename

                        var InsertTestimonialimage = await model.Updateimage(imagepath, t_id)
                        

                    }
                    return res.send({
                        result: true,
                        message: "Testimonial updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Testimonial"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Testimonial does not exists"
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

