const Car = require('../models/Car')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllCars = async (req, res) => {
    const cars = await Car.find({createdBy: req.user.userId}).sort('createdAt').populate('createdBy', 'name')
    res.status(StatusCodes.OK).json({cars, count:cars.length})
}

const getCar = async (req, res) => {
    const {
        user:{userId}, 
         params:{id:carId},
        } = req

    const car = await Car.findOne({
        _id:carId, 
        createdBy: userId
    }).populate('createdBy', 'name')
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
    const { body: updatedFields, user: { userId }, params: { id: carId } } = req;
  
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      throw new BadRequestError("No fields provided for update");
    }
  
    const car = await Car.findOneAndUpdate(
      { _id: carId, createdBy: userId },
      updatedFields,
      { new: true, runValidators: true }
    );
  
    if (!car) {
      throw new NotFoundError(`No car with id ${carId}`);
    }
  
    res.status(StatusCodes.OK).json({ car });
  };
  


const deleteCar = async (req, res) => {
    const {
        user:{userId},  
        params:{id:carId},
    } = req

    const car = await Car.findOneAndDelete({
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