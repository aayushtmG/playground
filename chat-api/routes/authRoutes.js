const express = require('express');
const router = express.Router();
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

router.post('/login',async(req,res)=>{
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
     const token = jwt.sign({userId:id,email,password},process.env.JWT_SECRET,{expiresIn: '1h'});
    return res.status(200).json({message: 'success',token,user:userData})
}catch(error){
         return res.status(400).json({message: 'Error Occurred',error})
    }

})

router.post('/register',async (req,res)=>{
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

module.exports = router;
