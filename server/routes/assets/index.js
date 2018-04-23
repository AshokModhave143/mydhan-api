//Import Libs
const route = require('express').Router();
const AssetService = require('./services/assets.service');

//Routes
route.post('/addAsset', AssetService.addAsset);
route.post('/deleteAsset', AssetService.deleteAsset);
rouite.post('/updateAsset', AssetService.updateAsset);

//Export Module
module.exports = route;
