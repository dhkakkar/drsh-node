const express = require('express');
const clc = require('cli-color');

const router = express.Router();
const endPointConfig = require('../config/routeConfig.json');
const { successResponse, unSuccessResponse } = require('../utils/services/response.service');
const validator = require('../utils/validator');

const { uploadMultipleFiles, uploadSingleFile } = require('../utils/services/fileOperation');
const jsonErrorHandler = async (err, req, res, next) => {
    unSuccessResponse(err, req, res)
}
for (let i = 0; i < endPointConfig.length; i++) {
    const config = endPointConfig[i];
    const middlewareArray = config.middlewares
    let arr = []

    for (let j = 0; j < middlewareArray.length; j++) {
        const middleware = require(`../middlewares/${middlewareArray[j]}`);
        arr.push(middleware.run);
    }
    let fileuploader;

    if (config.multipart) {
        if (!config.acceptingFiles) {
            throw new Error(`acceptingFiles are not defined in ${config.endPoint}`);
        } else if (!Array.isArray(config.acceptingFiles)) {
            throw new Error("accepting files should be an Array");
        } else {
            if (config.acceptingFiles.length === 1) {
                fileuploader = uploadSingleFile(config.acceptingFiles[0])
            } else if (config.acceptingFiles.length > 1) {
                fileuploader = uploadMultipleFiles(config.acceptingFiles)
            }
        }
    } else {
        fileuploader = (req, res, next) => { next() }
    }
    try {
        const mwareParams = [
            config.endPoint, fileuploader,
            (req, res, next) => {
                res.locals.config = config;
                res.locals.ref = {};
                next()
            },
            validator.run,
        ]
        Array.prototype.push.apply(mwareParams, arr);
        mwareParams.push(successResponse)
        router[config.method](...mwareParams)
    } catch (error) {
        console.log(config, "error::::::")
        throw error
    }

    console.log(clc.yellow(config.method.toUpperCase()), clc.cyan(config.endPoint))

}
router.use(jsonErrorHandler)


module.exports = router