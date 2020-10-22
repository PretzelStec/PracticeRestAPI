const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const mongoose = require('mongoose');

const authenticator = require('../authenticate');

//login route
router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            res.status(409).json({
                message : "Password and email mismatch"
            })
        }else{
            bcrypt.compare(req.body.password, user[0].password, (err, same) => {
                if(err){
                    res.status(409).json({
                        error : err
                    })
                }else if (!same){
                    res.status(401).json({
                        message : "Password and email mismatch"
                    })
                }else{
                    const token = jwt.sign({
                        userID: user[0]._id, 
                        companyID: user[0].companyID
                    }, process.env.SECRET_KEY)
                    res.json({message: "success", token : token});
                }
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            error : err
        })
    })
});


//register user route
router.post('/register', (req, res, next) =>{
    User.find({email:req.body.email})
    .exec()
    .then((user)=>{
        if (user.lenth >= 1){
            res.status(409).json({
                message: "Email already registered"
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if (err){
                    res.status(500).json({
                        error:err
                    })
                }else{
                    const newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        userName: req.body.userName,
                        email: req.body.email,
                        password: hash,
                        companyID: req.body.companyID
                    })
                    newUser
                    .save()
                    .then(()=>{
                        res.status(201).json({
                            message: "user created",
                            data:newUser
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            error: err
                        })
                    })
                }
            })      
        }
    })
    .catch(err => {
        res.status(401).json({
            error : err
        })
    })
});

router.get('/', authenticator, (req, res, next)=>{
    User.findById(req.user.userID)
    .exec()
    .then(user => {
        if(user){
            res.status(200).json({
                user:user
            })
        }else{
            res.status(404).json({
                message:'invalid'
            })
        }
    })
    .catch(err => {
        res.status(404).json({
            error:err
        })
    })
})

module.exports = router;