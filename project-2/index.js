const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const {createTables, createUser,getUsers} = require('./db_operation');


app.use(express.json());

const JWT_SECRET = 'secret'
const dataFilePath = path.join(__dirname, 'data.json')


const db = new sqlite3.Database('./mydb.sqlite',(err)=>{
    if(err){
    console.log(err)
    }
    console.log('connected database successfully')
});

db.on('open',()=>{
    // db.run('DROP TABLE  users')
     // createTables(db);

    const data = {
        email: 'aiyoustmg@gmail.com',
        password: 'pass'
    }

    createUser(db,data)
    getUsers(db)
})
app.post('/login',(req,res)=>{
    const {email,password} = req.body; 
    if(!email || !password ){
     res.status(200).json({message: 'BOTH EMAIL AND PASSWORD IS REQUIRED'})
        return;
    }
    fs.readFile(dataFilePath,(err,data) =>{
        if(err){
            return;
        }
        const users = JSON.parse(data.toString('utf8'));
        const userRequested = users.find(user => user.email == email);
        if(!userRequested){
            res.status(500).json({message: 'user doesnt exist'})
            return
        }
        if(userRequested.password != password){
            console.log(userRequested.password,password);
            res.status(500).json({message: 'INVALID CREDENTIALS'})
            return
        }
        const token = jwt.sign({email,password},JWT_SECRET);
        res.status(200).json({message: 'success',token,user: {email: userRequested.email}})
    })

    

})

app.post('/register',(req,res)=>{
    const {email,password,name,age}=req.body;
    if(!email || !password || !name){
     res.status(200).json({message: 'ID Creation failed: make sure to provide email, password and name'})
        return;
    }
    fs.readFile(dataFilePath,(err,data) =>{
        if(err){
            return;
        }
        const newUser = {...req.body};
        const users = JSON.parse(data.toString('utf8'));
        const existinguser = users.find(u => u.email = email);
        if(existinguser){
        res.status(400).json({message: 'user already exists'})
                return
        }

        users.push(newUser);
        
        fs.writeFile(dataFilePath,JSON.stringify(users),(err)=>{
            if(err){
                console.log(err);
        res.status(500).json({message: 'failed'})
                return
            }
        res.status(200).json({message: 'sucess',users})
        });
        
    })
    
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
