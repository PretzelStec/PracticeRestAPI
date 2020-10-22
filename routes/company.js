const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Company = require('../models/Company');
const mongoose = require('mongoose');

const authenticator = require('../authenticate');
const User = require('../models/User');

router.get('/', authenticator, (req, res, next)=>{
    Company.find({companyID:req.user.companyID})
    .exec()
    .then(company => {
        if(company.length < 1){
            res.status(404).json({
                message:"company with ID does not exist"
            })
        }else{
            res.status(200).json({
                message:"success",
                company:company
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.post('/', authenticator, (req, res, next)=>{
    Company.find({companyID:req.body.comapnyID})
    .exec()
    .then(company => {
        if (company.length >= 1){
            res.status(409).json({
                message : "comapany ID alread exists"
            })
        }else{
            const newCompany = Company({
                _id: mongoose.Types.ObjectId(),
                companyID: req.body.companyID,
                name: req.body.name,
                address: req.body.address
            })
            newCompany
            .save()
            .then(company => {
                res.status(201).json({
                    message: "created company",
                    company: company
                })
            })
            .catch(err => {
                res.status(401).json({
                    error:err
                })
            })
        }
    })
    .catch()
})


module.exports = router;