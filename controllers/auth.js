const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {
    const {fname,lname, email, password} = req.body;
    const name = `${fname} ${lname}`
    const user = await User.create({name, email, password,})
    const token = user.createJWT()
    console.log(user.role)
    res.status(StatusCodes.CREATED).json({ user: {name: user.name, role: user.role}, token })
}

const login = async (req, res) => {
    const { email, password} = req.body 
    
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError ('Invalid Credentials')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{id:user._id, name:user.name, role: user.role}, token})
}

module.exports = {
    register,
    login, 
}