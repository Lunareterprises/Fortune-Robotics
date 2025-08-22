var model = require("../model/Banner");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");

module.exports.AddBannerVideo = async (req, res) => {
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
            console.log("image:",files.image);
            console.log("video:",files.video);


            if (files) {
                if (files.image) {
                    files.image = Array.isArray(files.image) ? files.image[0] : files.image;

                    var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() +
                    "/uploads/banner/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let type = 'image'
                    let filepathh =
                        "/uploads/banner/" + files.image.originalFilename;
                    let AddBanner = await model.AddBannerQuery(type,filepathh)
                    // console.log(AddBanner.insertId, "AddBanner");

                })
                }

                if (files.video) {
                    files.video = Array.isArray(files.video) ? files.video[0] : files.video;

                    var oldPath = files.video.filepath;
                var newPath =
                    process.cwd() +
                    "/uploads/banner/" +
                    files.video.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let type = 'video'
                    let filepathh =
                        "/uploads/banner/" + files.video.originalFilename;
                    let AddBanner = await model.AddBannerQuery(type,filepathh)
                    // console.log(AddBanner.insertId, "AddBanner");

                })
                }
                
                return res.send({
                    result: true,
                    message: "banner Uploaded sucessfully"
                });

            } else {
                return res.send({
                    result: true,
                    message: "banner upload failed"
                })

            }

        })

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}



module.exports.listBanner = async (req, res) => {
    try {

        let listBanner = await model.listBannerQuery();
        if (listBanner.length > 0) {
            return res.send({
                result: true,
                message: "data retrived",
                list: listBanner
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


module.exports.DeleteBanner = async (req, res) => {
    try {

        var banner_id = req.body.banner_id;
        let deletebanner = await model.RemoveBanner(banner_id)

        if (deletebanner.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Banner removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete Banner"
            })
        }
    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })
    }
}