const Car = require('../models/Car')


const { StatusCodes } = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllCars = async (req, res) => {
    const cars = await Car.find().sort('createdAt')
    res.status(StatusCodes.OK).json({cars, count:cars.length})
}

const getCar = async (req, res) => {
    const {
        user:{userId}, 
         params:{id:carId},
        } = req

    const car = await Car.findOne({
        _id:carId, 
    })
    if(!car){
        throw new NotFoundError(`No car with id ${carId}`)
    }
    res.status(StatusCodes.OK).json({car})
}

const createCar = async (req, res) => {
    req.body.createdBy = req.user.userId
    const car = await Car.create(req.body)
    res.status(StatusCodes.CREATED).json({ car })
}

const updateCar = async (req, res) => {
    const {
        body: {make, model, year, license},
        user:{userId},  
        params:{id:carId},
    } = req

    if(make === '' || model === '' || year === '' || license === ''){
        throw new BadRequestError(`Car information cannot be empty`)
    }

    const car = await Car.findByIdAndUpdate({_id:carId, createdBy:userId}, req.body, {new:true, 
    runValidators: true})

    if(!car){
        throw new NotFoundError(`No car with id ${carId}`)
    }
    res.status(StatusCodes.OK).json({car})
   
}


const deleteCar = async (req, res) => {
    const {
        user:{userId},  
        params:{id:carId},
    } = req

    const car = await Car.findByIdAndRemove({
        _id: carId,
        createdBy:userId
    })
    if(!car){
        throw new NotFoundError(`No car with this id ${carId}`)
    }
    res.status(StatusCodes.OK).json({msg: "The entry was deleted"})
}

module.exports ={
    getAllCars,
    getCar, 
    createCar, 
    updateCar, 
    deleteCar,  
}