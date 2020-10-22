const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Data = require('../models/Data');
const mongoose = require('mongoose');

const authenticator = require('../authenticate');

// get all user data
router.get('/', authenticator, (req, res, next) => {
    Data.find({companyID: req.user.companyID})
    .exec()
    .then(data => {
        res.status(200).json({
            data: data
        })
    })
    .catch(err => {
        res.status(401).json({
            error: err
        })
    })
})
// get user data coorisponding to id
router.get('/:id', authenticator, (req, res, next) => {
    Data.findById(req.params.id)
    .exec()
    .then((data)=>{
        if(!data){
            res.status(404).json({
                message: "ID not found"
            })
        }else{
            if(data.companyID === req.user.companyID){
                res.status(200).json({
                    message: "success",
                    data: data
                })
            }else{
                res.status(409).json({
                    message: "unauthorized user"
                })
            }
        }
    })
    .catch(err => {
        res.status(404).json({
            error:err
        })
    })
})

// post new data from authenticated user
router.post('/', authenticator, (req, res, next) => {
    const newData = Data({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        destination: req.body.destination,
        price: req.body.price,
        dateAdded: req.body.dateAdded,
        companyID: req.user.companyID
    })
    newData
    .save()
    .then((data)=>{
        res.status(201).json({
            message: "success",
            data: data
        })
    })
    .catch(err => {
        res.status(401).json({
            error: err
        })
    })
})

// authenticate user middleware
module.exports = router;