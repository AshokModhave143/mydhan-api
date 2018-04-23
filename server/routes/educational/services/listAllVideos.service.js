//Import Libs
const HttpStatus = require('http-status-codes');

//Functions
const listVideo = (req, res)=> {
    return res.status(HttpStatus.OK).send("You will get the list of video JSON here");
};

//Exports
module.exports = listVideo;