var model = require('../model/products')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

module.exports.AddProduct = async (req, res) => {
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
            let { name,buy_rent, rob_model, short_description, description, price, discount_price, discount, highlights, product_used_places, dimensions, screen, camera, body_colour, mb_ram, stand_by_time, head_pitch_angle, system, navigation_accuracy, weight, max_speed, battery_type, battery_life, charging_time, sensors, connectivity, material } = fields
            if (!name || !description || !short_description) {
                return res.send({
                    result: false,
                    messaage: "All fields are required"
                })
            }
            // var checkProduct = await model.checkProduct(name)
            // console.log(checkProduct);
            var Insertproduct = await model.AddProductQuery(name,buy_rent,
                rob_model,
                short_description,
                description,
                price,
                discount_price,
                discount,
                highlights,
                product_used_places,
                dimensions,
                max_speed,
                battery_life,
                charging_time,
                sensors,
                connectivity,
                material,
                screen,
                camera,
                body_colour,
                mb_ram,
                stand_by_time,
                head_pitch_angle,
                system,
                navigation_accuracy,
                weight,
                battery_type)
            if (Insertproduct.affectedRows > 0) {

                let product_id = Insertproduct.insertId
                if (files) {

                    // Normalize to array: handles both single and multiple image uploads
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                    const brochureFiles = Array.isArray(files.brochure) ? files.brochure : [files.brochure];


                    for (const file of imageFiles) {
                        console.log("file :", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const newPath = path.join(process.cwd(), '/uploads/products', file.originalFilename);

                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/products/" + file.originalFilename;

                        var insertImage = await model.AddProductImages(product_id, imagePath);

                        console.log("Insert result:", insertImage);
                        if (insertImage.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: `failed to insert product image ${file.originalFilename}`
                            })
                        }
                    }

                    for (const file of brochureFiles) {
                        console.log("file :", file);

                        if (!file || !file.filepath || !file.originalFilename) continue;

                        const oldPath = file.filepath;
                        const newPath = path.join(process.cwd(), '/uploads/brochures', file.originalFilename);

                        const rawData = fs.readFileSync(oldPath);
                        fs.writeFileSync(newPath, rawData);

                        const imagePath = "/uploads/brochures/" + file.originalFilename;

                        var insertbrochureFiles = await model.AddBrochureFiles(product_id, imagePath);

                        console.log("Insert result:", insertImage);
                        if (insertImage.affectedRows == 0) {
                            return res.send({
                                result: false,
                                message: `failed to insert brochure file ${file.originalFilename}`
                            })
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Product Details Added Successfully',
                    });

                } else {
                    return res.send({
                        result: false,
                        message: "product images are missing"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "failed to add Product"
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

module.exports.listProduct = async (req, res) => {
    try {
        let { p_id } = req.body || {}

        let condition = ''
        if (p_id) {
            condition = `where p_id ='${p_id}'`
        }
        let listProduct = await model.listProductQuery(condition);

        if (listProduct.length > 0) {
            let getproducts = await Promise.all(
                listProduct.map(async (el) => {
                    let product_id = el.p_id
                    let productimages = await model.listProductImageQuery(product_id);
                    el.productimages = productimages
                    return el
                })
            )
            return res.send({
                result: true,
                message: "data retrived",
                list: getproducts
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


module.exports.DeleteProduct = async (req, res) => {
    try {

        var p_id = req.body.p_id;
        let deleteProduct = await model.RemoveProduct(p_id)

        if (deleteProduct.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Product removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Product"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.EditProduct = async (req, res) => {
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

            let { p_id, name,buy_rent, rob_model, short_description, description, price, discount_price, discount, highlights, product_used_places, dimensions, screen, camera, body_colour, mb_ram, stand_by_time, head_pitch_angle, system, navigation_accuracy, weight, max_speed, battery_type, battery_life, charging_time, sensors, connectivity, material } = fields
            console.log("p_id", p_id);

            if (!p_id) {
                return res.send({
                    result: false,
                    messaage: "Product Id is required"
                })
            }

            var checkProduct = await model.CheckProductQuery(p_id)
            console.log(checkProduct);

            if (checkProduct.length > 0) {
                console.log(p_id);

                let condition = ``;
                if (name) {
                    if (condition == '') {
                        condition = `SET p_name = "${name}" `;
                    } else {
                        condition += `, p_name = "${name}"`;
                    }
                }
                if (buy_rent) {
                    if (condition == '') {
                        condition = `SET p_buy_rent = "${buy_rent}" `;
                    } else {
                        condition += `, p_buy_rent = "${buy_rent}"`;
                    }
                }
                if (rob_model) {
                    if (condition == '') {
                        condition = `SET p_model = "${rob_model}" `;
                    } else {
                        condition += `, p_model = "${rob_model}"`;
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
                if (product_used_places) {
                    if (condition == '') {
                        condition = `SET p_product_used_places = "${product_used_places}" `;
                    } else {
                        condition += `, p_product_used_places = "${product_used_places}"`;
                    }
                }
                if (dimensions) {
                    if (condition == '') {
                        condition = `SET p_dimensions = "${dimensions}" `;
                    } else {
                        condition += `, p_dimensions = "${dimensions}"`;
                    }
                }
                if (screen) {
                    if (condition == '') {
                        condition = `SET p_screen = "${screen}" `;
                    } else {
                        condition += `, p_screen = "${screen}"`;
                    }
                }
                if (camera) {
                    if (condition == '') {
                        condition = `SET p_camera = "${camera}" `;
                    } else {
                        condition += `, p_camera = "${camera}"`;
                    }
                }
                if (body_colour) {
                    if (condition == '') {
                        condition = `SET p_body_colour = "${body_colour}" `;
                    } else {
                        condition += `, p_body_colour = "${body_colour}"`;
                    }
                }
                if (mb_ram) {
                    if (condition == '') {
                        condition = `SET p_ram = "${mb_ram}" `;
                    } else {
                        condition += `, p_ram = "${mb_ram}"`;
                    }
                }
                if (stand_by_time) {
                    if (condition == '') {
                        condition = `SET p_stand_by_time = "${stand_by_time}" `;
                    } else {
                        condition += `, p_stand_by_time = "${stand_by_time}"`;
                    }
                }
                if (head_pitch_angle) {
                    if (condition == '') {
                        condition = `SET p_head_pitch_angle = "${head_pitch_angle}" `;
                    } else {
                        condition += `, p_head_pitch_angle = "${head_pitch_angle}"`;
                    }
                }
                if (system) {
                    if (condition == '') {
                        condition = `SET p_system = "${system}" `;
                    } else {
                        condition += `, p_system = "${system}"`;
                    }
                }
                if (navigation_accuracy) {
                    if (condition == '') {
                        condition = `SET p_navigation_accuracy = "${navigation_accuracy}" `;
                    } else {
                        condition += `, p_navigation_accuracy = "${navigation_accuracy}"`;
                    }
                }
                if (weight) {
                    if (condition == '') {
                        condition = `SET p_weight = "${weight}" `;
                    } else {
                        condition += `, p_weight = "${weight}"`;
                    }
                }
                if (max_speed) {
                    if (condition == '') {
                        condition = `SET p_max_speed = "${max_speed}" `;
                    } else {
                        condition += `, p_max_speed = "${max_speed}"`;
                    }
                }
                if (battery_type) {
                    if (condition == '') {
                        condition = `SET p_battery_type = "${battery_type}" `;
                    } else {
                        condition += `, p_battery_type = "${battery_type}"`;
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
                    var EditProduct = await model.ChangeProduct(condition, p_id)
                }
                if (EditProduct.affectedRows) {

                    if (files) {
                        const fileKeys = Object.keys(files).filter(item => item !== 'image' && item !== 'brochure');
                        console.log("fileKeys :", fileKeys);

                        if (fileKeys.length > 0) {
                            await model.DeleteFilesQuery(p_id, fileKeys);
                        }
                    }

                    if (files.image) {
                        // Normalize to array: handles both single and multiple image uploads
                        const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

                        for (const file of imageFiles) {
                            if (!file || !file.filepath || !file.originalFilename) continue;

                            const oldPath = file.filepath;
                            const newPath = path.join(process.cwd(), '/uploads/products', file.originalFilename);

                            const rawData = fs.readFileSync(oldPath);
                            fs.writeFileSync(newPath, rawData);

                            const imagePath = "/uploads/products/" + file.originalFilename;

                            var insertImage = await model.AddProductImages(p_id, imagePath);

                            console.log(" update prodcut image:", insertImage);
                            if (insertImage.affectedRows == 0) {
                                return res.send({
                                    result: false,
                                    message: `failed to insert product image ${file.originalFilename}`
                                })
                            }
                        }

                    }

                    if (files.brochure) {
                        files.brochure = Array.isArray(files.brochure) ? files.brochure[0] : files.brochure;

                        var oldPath = files.brochure.filepath;
                        var newPath =
                            process.cwd() +
                            "/uploads/brochures/" + files.brochure.originalFilename
                        let rawData = fs.readFileSync(oldPath);
                        console.log(oldPath);

                        fs.writeFileSync(newPath, rawData)
                        var imagepath = "/uploads/brochures/" + files.brochure.originalFilename

                        var InsertTestimonialimage = await model.AddBrochureFiles(p_id, imagepath)

                    }
                    return res.send({
                        result: true,
                        message: "Product updated successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to update Product"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Product does not exists"
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

