const express = require('express');
const app = express()
const fs = require('fs');
const port = process.env.PORT || 5000;
const authRoute = require('./routes/auth');
const quizRoute = require('./routes/quiz');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

dotenv.config();


app.use(bodyParser.urlencoded())
app.get('/',(req,res)=>{
    res.send("Hello World!");
})

app.use((req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFile('log.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log(err);
        }
    }
    
    )
    
    next();
})

app.use(cors())
app.use(express.json())
app.use('/v1/auth',authRoute)
app.use('/v1',quizRoute)



app.use((err,req,res,next)=>{
    const reqString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`
    fs.writeFile('error.txt',reqString,{flag: 'a'},(err)=>{
        if(err){
            console.log(err);
        }
    }
    
    )
    res.status(500).send('Internal server error')
    next();
})

app.listen(port,()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log(`Server is running at port ${port}`))
    .catch((err)=>(console.log(err)))
})