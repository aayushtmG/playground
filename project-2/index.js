const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const {createTables, createUser,getUsers,getUser} = require('./db_operation');


app.use(express.json());

const JWT_SECRET = 'secret'
const dataFilePath = path.join(__dirname, 'data.json')


const db = new sqlite3.Database('./mydb.sqlite',(err)=>{
    if(err){
    console.log(err)
    }
    console.log('connected database successfully')
    // getUsers(db, (err,users)=>{
    //    if(err){
    //         console.log(err);
    //         return err;
    //     }
    //     if(users.length == 0 ){
    //         console.log('Empty table Users');
    //         return;
    //     }
    //     console.log(users);
    // })
});


app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password ){
   return  res.status(403).json({message: 'BOTH EMAIL AND PASSWORD IS REQUIRED'})
    }
    getUser(db,req.body,(err,user)=>{
        if(err){
         return res.status(400).json({message: 'Error Occurred',error: err})
        }
         const token = jwt.sign({email,password},JWT_SECRET,{expiresIn: '1h'});
        return res.status(200).json({message: 'success',token,user:{email: user.email,password: user.password}})
    })
    

})

app.post('/register',(req,res)=>{
    const {email,password,name,age}=req.body;
    if(!email || !password || !name){
     res.status(200).json({message: 'ID Creation failed: make sure to provide email, password and name'})
        return;
    }
    createUser(db,req.body,(err,newUser)=>{
        if(err){
            console.log(err);
         return res.status(400).json({message: 'Error occurred',error:err})
        }
        console.log('user created: ',newUser);
        return res.status(200).json({message: 'success',newUser})
    });  
})

app.use(['/profile','/users'],(req,res,next)=>{
    if(!req.headers.authorization){
        res.status(500).json({message: 'Not Authorized!!!'})
            return
    }

    const token = req.headers.authorization.split(' ')[1];
    
    try{
    const decoded = jwt.verify(token,JWT_SECRET)
        const {iat,exp,...userplayload } = decoded
        req.user = userplayload
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Invalid TOKEN'})
            return

    }
})


app.get('/users',(req,res)=>{
    fs.readFile(dataFilePath,(err,data) =>{
        if(err){
            return;
        }
        const users = JSON.parse(data.toString('utf8'));
        return res.status(200).json({message: 'success',users});
    })
})

app.get('/profile',(req,res)=>{
    fs.readFile(dataFilePath,(err,data) =>{
        if(err){
            return;
        }
        const users = JSON.parse(data.toString('utf8'));
        const user = users.find(user => user.email == req.user.email);
        return res.status(200).json({message: 'success',user});
    })
})





app.listen(8000,()=>{
console.log('listening to port 8000');});
