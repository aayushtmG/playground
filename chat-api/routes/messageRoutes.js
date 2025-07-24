const express = require('express');
const router = express.Router();

//send message to another user
router.post('/send',async(req,res)=>{
   res.send(""); 
})



//sent messages
router.get('/sent',async(req,res)=>{

})


//received messages
router.get('/inbox',async(req,res)=>{

})


module.exports = router;



