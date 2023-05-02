const User = require('../models/User')

const checkRole = async (req, res, next) => {
    console.log(req.user.role)
    if(req.user.role === 'admin'){
       next();
    }else{
        res.json({msg:"You are not authorized to access this route"})
    }
}


module.exports = checkRole