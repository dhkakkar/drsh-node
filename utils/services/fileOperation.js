const multer = require('multer');
const { FileUploadError } = require('../handler/error');
const randomstring = require('randomstring')
const path = require('path');
const fs = require('fs')
const { unSuccessResponse } = require('./response.service');

const fileConfig = require('../../config/fileConfig.json');
const appConfig = require('../../config/appConfig.json');

const awsRegion = process.env.AWS_ORIGIN
const awsKey = process.env.AWS_KEY
const awsSecret = process.env.AWS_SECRET
const awsUser = process.env.AWS_USER

const bucket = appConfig.S3.bucket;

const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
// const { S3RequestPresigner, getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const multerS3 = require("multer-s3");
const s3 = new S3Client({
    region: awsRegion,
    credentials: {
        secretAccessKey: awsSecret,
        accessKeyId: awsKey
    }
})

//store inside project
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file) {
            const fileDir = 'public' + fileConfig[file.fieldname].path
            //create new folder if not present
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }
            callback(null, fileDir);
        } else {
            callback(null, false)
        }

    },
    filename: function (req, file, callback) {
        callback(null, fileConfig[file.fieldname].prefix + Date.now() + '_' + randomstring.generate(15) + path.extname(file.originalname));
    }
});

//store in s3
const storageS3 = multerS3({
    s3,
    bucket,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const fileName =
            fileConfig[file.fieldname].prefix +
            Date.now() +
            "_" +
            randomstring.generate(15) +
            path.extname(file.originalname);
        const fileDir = fileConfig[file.fieldname].dir;
        cb(null, fileDir + "/" + fileName)
    }

})

const uploadMedia = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.length && file.length > 0) {
            console.log(file.length)
        }
        let ext = path.extname(file.originalname)
        ext = ext.replace('.', '')
        if (fileConfig[file.fieldname].supportExt.indexOf(ext) > -1) {
            callback(null, true)
        } else {
            callback(new FileUploadError({ _ErrCode: 'FILE_UPLOAD_ERROR', message: `File format for ${fileConfig[file.fieldname].nick_name} not supported` }), false)
        }
    }

})

const uploadMediaS3 = multer({
    storage: storageS3,
    fileFilter: (req, file, callback) => {
        if (file.length && file.length > 0) {
            console.log(file.length)
        }
        let ext = path.extname(file.originalname)
        ext = ext.replace('.', '')
        if (fileConfig[file.fieldname].supportExt.indexOf(ext) > -1) {
            callback(null, true)
        } else {
            callback(new FileUploadError({ _ErrCode: 'FILE_UPLOAD_ERROR', message: `File format for ${fileConfig[file.fieldname].nick_name} not supported` }), false)
        }
    }

})


const uploadMultipleFiles = (filesArr) => {
    return (req, res, next) => {
        const acceptingFiles = Object.keys(fileConfig);
        let error;
        filesArr.forEach(element => {
            if (acceptingFiles.indexOf(element) < 0) {
                error = new FileUploadError(`${element} is not configured  application`)
                return false;
            }
        });
        if (error) {
            unSuccessResponse(req, res, error)
        } else {
            let fieldsArr = [];
            let fieldsArrS3 = [];
            for (let i = 0; i < filesArr.length; i++) {
                const file = fileConfig[filesArr[i]];
                const maxcount = file.maxCount ? file.maxCount : 1;

                let obj = {
                    name: filesArr[i], maxcount
                }
                if (file.storage === "S3") {
                    fieldsArrS3.push(obj);
                } else {
                    fieldsArr.push(obj);
                }

            }
            if (fieldsArr.length > 0) {
                let upload = uploadMedia;
                let uploading = upload.fields(fieldsArr)
                uploading(req, res, (err) => {
                    if (err) {
                        unSuccessResponse(req, res, err)
                    } else {
                        if (fieldsArrS3.length > 0) {
                            let uploads3 = uploadMediaS3;
                            let uploadings3 = uploads3.fields(fieldsArrS3);
                            uploadings3(req, res, (err) => {
                                if (err) {
                                    unSuccessResponse(req, res, err)
                                } else {
                                    next()
                                }
                            })
                        }
                    }
                })
            } else {
                let uploads3 = uploadMediaS3;
                let uploadings3 = uploads3.fields(fieldsArrS3);
                uploadings3(req, res, (err) => {
                    if (err) {
                        unSuccessResponse(req, res, err)
                    } else {
                        next()
                    }
                })
            }

        }
    }
}

const uploadSingleFile = (fileName) => {
    return (req, res, next) => {
        const acceptingFiles = Object.keys(fileConfig);
        if (acceptingFiles.indexOf(fileName) < 0) {
            const err = new FileUploadError("This file is not configured");
            unSuccessResponse(err, req, res);
            return;
        }
        let storage_ = storage;
        if (fileConfig[fileName].storage === "S3") {
            storage_ = storageS3;
        }
        const maxCount = fileConfig[fileName].maxCount || 1;

        const upload = multer({
            storage: storage_,
            fileFilter: (req, file, callback) => {
                if (file.length && file.length > 0) {
                    console.log(file.length)
                }
                let ext = path.extname(file.originalname)
                ext = ext.replace('.', '')
                if (fileConfig[file.fieldname].supportExt.indexOf(ext) > -1) {
                    callback(null, true)
                } else {
                    callback(new FileUploadError({ _ErrCode: 'FILE_UPLOAD_ERROR', message: `File format for ${fileConfig[file.fieldname].nick_name} not supported` }), false)
                }
            },
            limits: {
                files: maxCount
            }


        })
        let uploading = upload.single(fileName);
        if (fileConfig[fileName].allowMultiple) {
            // uploading = upload.array(fileName);
            uploading = upload.array(fileName, fileConfig[fileName].maxCount);
        }
        uploading(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    let error = new FileUploadError(err.message)
                    if (err.code == "LIMIT_FILE_COUNT") {
                        error = new FileUploadError(`You can upload maximum ${maxCount} file(s)`);
                        error.displayMessage = `You can upload maximum ${maxCount} file(s)`;
                    }

                    unSuccessResponse(error, req, res);
                } else if (err) {
                    const error = new FileUploadError(err)
                    unSuccessResponse(error, req, res);
                }

            } else {
                next();
            }
        });
    };
}

const deleteFile = (key) => {
    try {
        const bucketParams = { Bucket: bucket, Key: key };
        s3.send(new DeleteObjectCommand(bucketParams));
        console.log('uploaded file deleted from server')
        return
    } catch (error) {
        console.log(error)
        throw new FileUploadError(error)
    }
}

const getFileBlob = async (key) => {
    try {
        const bucketParams = { Bucket: bucket, Key: key };
        // Create a helper function to convert a ReadableStream to a string.
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
            });

        // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
        const data = await s3.send(new GetObjectCommand(bucketParams));
        // return data; // For unit tests.
        // Convert the ReadableStream to a string.
        const bodyContents = await streamToString(data.Body);
        // console.log(bodyContents);
        return bodyContents;
    } catch (error) {
        console.log(error)
        throw new FileUploadError(error)
    }
}
/**
 * 
 * @param {string} key S3 Object key
 * @returns presigned url
 */

//  const getPresignedURL = async (key) => {
//     try {
//         const bucketParams = { Bucket: bucket, Key: key };
//         const command = new GetObjectCommand(bucketParams)
//         const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//         return url;
//     } catch (error) {
//         throw new Error(error);
//     }

// }
// const getBlob = async (key) => {
//     try {
//         const bucketParams = { Bucket: bucket, Key: key };
//         const command = new GetObjectCommand(bucketParams)
//         const url = await getSignedUrl(s3, command);
//         const data = await fetch(url);
//         // const blob = await data.blob();
//         const buffer = await data.buffer();
//         const base64 = buffer.toString('base64')
//         return base64
//     } catch (error) {
//         throw new Error(error);
//     }

// }


module.exports = {
    uploadMultipleFiles,
    uploadSingleFile,
    deleteFile,
    getFileBlob,
    // getPresignedURL,
    //    getBlob 
}