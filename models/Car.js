const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema(
  {
    vinnum:{
      type:String, 
      minlength: 17,
    },
    year:{
      type:String, 
      required: [true, 'Please provide year of the car']
    },
    
    make: {
      type: String,
      required: [true, 'Please provide make of the car'],
      maxlength: 30,
    },
    model: {
      type: String,
      required: [true, 'Please provide model of the car'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'review in progress', 'awaiting customer approval', 'repair complete'],
      default: 'pending',
    },
    repairConcerns: {
      type: String, 
      required: [true, 'Please provide repair concerns'],

    },
    technicianComments: {
      type: String, 
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model('Car', CarSchema)

