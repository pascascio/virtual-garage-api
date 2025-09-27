const express = require('express')
const router = express.Router()

const {
  createCar,
  deleteCar,
  getAllCars,
  updateCar,
  getCar,
} = require('../controllers/admin')

router.route('/').post(createCar).get(getAllCars).patch(updateCar)

router.route('/:id').get(getCar).delete(deleteCar).patch(updateCar)

module.exports = router
