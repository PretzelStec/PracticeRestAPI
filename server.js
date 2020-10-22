const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const userRouter = require('./routes/user');
const dataRouter = require('./routes/data');
const companyRouter = require('./routes/company');
mongoose.connect(
    process.env.ATLAS_URL,
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true
    },
    (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Database connected');
        }
    }
)

app.use(express.json());

app.use('/user', userRouter);
app.use('/data', dataRouter);
app.use('/company', companyRouter);


app.listen(3000, ()=>{
    console.log('Server started');
})