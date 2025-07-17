const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const {PrismaClient} = require('./generated/prisma');

const prisma = new PrismaClient();

app.use(express.json());

const JWT_SECRET = 'secret';




app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password ){
   return  res.status(403).json({message: 'BOTH EMAIL AND PASSWORD IS REQUIRED'})
    }
    try{
        const user = await prisma.user.findUnique({
            where: {email: email}
        })


        if(!user || user.password !== req.body.password){
            return   res.status(403).json({message: 'Invalid Credentials'})
        }

    const {id, password, ...userData} = user;        
     const token = jwt.sign({email,password},JWT_SECRET,{expiresIn: '1h'});
    return res.status(200).json({message: 'success',token,user:userData})
}catch(error){
         return res.status(400).json({message: 'Error Occurred',error})
    }

})

app.post('/register',async (req,res)=>{
    const {email,password,name,age}=req.body;
    if(!email || !password || !name){
     res.status(200).json({message: 'ID Creation failed: make sure to provide email, password and name'})
        return;
    }
    try{
        const user = await prisma.user.create({
            data: {...req.body}
        })
            if(!user){
             return res.status(400).json({message: 'Failed creating user'})
            }
            console.log('user created: ',user);
            return res.status(200).json({message: 'success',user})
    }catch(err){
                 return res.status(400).json({message: 'Failed creating user',error: err})
    }
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
        console.log(userplayload);
        req.user = userplayload
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Invalid TOKEN'})
            return

    }
})


app.get('/users',async (req,res)=>{
    try{
        const users = await prisma.user.findMany({omit:{id: true,password: true}});
        return res.status(200).json({message: "Success",users});
    }catch(error){
 return   res.status(500).json({message: 'Error Occurred',error})

    }
})


app.get('/profile',async(req,res)=>{
    try{
        const user = await prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        ,omit:{id: true,password: true}});

        return res.status(200).json({message: "Success",user});
    }catch(error){
     return   res.status(500).json({message: 'Error Occurred',error})

    }
    

})





app.listen(8000,()=>{
console.log('listening to port 8000');});
