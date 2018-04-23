//Import libs
const router = require('express').Router();

//Routes
router.get('/getVideoInfo', require('./services/getVideoInfo.service'));
router.get('/getvideolist', require('./services/listAllVideos.service'));
router.get('/deleteVideo', require('./services/deleteVideo.service'));
router.post('/uploadVideo', require('./services/uploadVideo.service'));

//Export
module.exports = router;
