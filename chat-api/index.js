const express = require('express');
const isAuth = require('./utils/isAuth');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const {PrismaClient} = require('./generated/prisma');
dotenv.config();

const prisma = new PrismaClient();

app.use(express.json());

const JWT_SECRET = 'secret';



app.use('/auth',authRoutes);


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
