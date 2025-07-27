const express = require('express');
const router = express.Router();
const {PrismaClient} = require("../generated/prisma")

const prisma = new PrismaClient();




//sending messages
router.post('/send',async(req,res)=>{
    const {receiverId,content} = req.body; 
    if(!receiverId || !content){
    return res.status(400).json({message: "receiverId or content missing" })
    }
    if(receiverId == req.user.userId){
        return res.status(400).json({message: "Message cannot be sent to the same user" })
    }
    const receiver = await prisma.user.findUnique({where: {
        id: receiverId * 1
    }})
    if(!receiver){
        return res.status(400).json({message: "Receiver does'nt exist"});
    }
    const message = await prisma.message.create({data:{
        senderId: req.user.userId,
        receiverId : receiverId * 1,
        content
    }})
return res.status(200).json({message:"A message was created",createdMessage: message});
})


//get messages of a user
router.get('/:id',async(req,res)=>{
    const senderId = req.params.id;
    const messages = await prisma.message.findMany({where: {
        OR:[
            {
        receiverId: req.user.userId,
        senderId: senderId  * 1
            },
            {
        senderId: req.user.userId,
        receiverId: senderId  * 1
            }
        ]
    }, orderBy:{
            createdDate: 'asc'
        }})

    return res.status(200).json({message: "Successfully fetched messages",
    messages
    }) 

})
    

module.exports = router;



