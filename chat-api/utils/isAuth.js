const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    if(!req.headers.authorization){
        res.status(500).json({message: 'Not Authorized!!!'})
            return
    }

    const token = req.headers.authorization.split(' ')[1];
    try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            const {iat,exp,...userplayload } = decoded
            req.user = userplayload
            next();
    }catch(e){
        console.log(e);
        res.status(500).json({message: 'Invalid TOKEN'})
            return

    }
}
