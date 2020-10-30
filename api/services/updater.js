var express = require('express');
var router = express.Router();
const Updater = require('../models/updaterModel');

router.get('/', function(req, res, next) {
    const service = req.body.service
    Updater.findOne({service: service})
    .then(response => {
        res.status(304).json(response)
    })
    .catch(err =>{
        res.status(404).json({
            message: err
        })
    })
})
module.exports = router;