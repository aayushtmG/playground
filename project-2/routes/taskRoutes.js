const express = require('express');
const router = express.Router();
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();


//fetching all tasks belonging to the user
router.get('/',async(req,res)=>{
    const tasks = await prisma.task.findMany({where: {authorId: req.user.userId},omit: {authorId: true}});
return res.status(200).json({message: 'Success',tasks});
})

router.post('/create',async(req,res)=>{
    const {title,description} =req.body;
    if(!title || !description){
    return res.status(400).json({message: 'Both title and description should be provided'})
    }

    const task = await prisma.task.create({
        data: {title,description,authorId: req.user.userId}
    });
return res.status(200).json({message: 'Success',task});
})

//getting single task
router.get('/:id',async(req,res)=>{
    const taskId = req.params.id * 1; //passing int for id field
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            authorId: req.user.userId // making sure the task belongs to the user
        }
    })
    if(!task){
        return res.status(404).json({message: 'Couldnt find the task'});
    }

    return res.status(200).json({message: 'Success',task});
});


//updating a task
router.patch('/:id',async(req,res)=>{
    try{
    const taskId = req.params.id * 1; //passing int for id field
    const task = await prisma.task.update({
        where: {
            id: taskId,
            authorId: req.user.userId // making sure the task belongs to the user
        },data:{...req.body}
    })
    if(!task){
        return res.status(404).json({message: 'Couldnt find the task'});
    }

    return res.status(200).json({message: 'Successfully updated',task});
}catch(error){
    return res.status(500).json({message: "Error occurred",error: error.message})
    }
});

router.delete('/:id',async(req,res)=>{

    const taskId = req.params.id * 1;
    const task = await prisma.task.delete({where: {id : taskId, authorId: req.user.userId}});
    return res.status(200).json({
      message: 'Task deleted successfully',
      deletedTask: task
});

});


module.exports = router;

