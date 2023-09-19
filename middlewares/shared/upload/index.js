const { NoFileSelectedError } = require("../../../utils/handler/error");

module.exports.run = (req, res, next)=>{
    const fileArr = req.files[req.params.imageName];
    if(fileArr.length == 0){
        throw new NoFileSelectedError("Please select atleast one file");
    }
    const imgArr=[];
    for (let i = 0; i < fileArr.length; i++) {
        imgArr.push(fileArr[i].key);
        
    }
    const response = {}
    response[req.params.imageName] = imgArr;

    res.locals.rootData = response;
    next();
}