const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema(
  {
    year:{
      type:Number, 
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
    license: {
      type: String,
      required: [true, 'Please provide the car license number'], 
      maxlength: 20, // 
    },
    status: {
      type: String,
      enum: ['pending','reviewing', 'in-progress', 'awaiting', 'repair-complete'],
      default: 'pending',
    },  
    repairConcerns: {
      type: String, 
      required: [true, 'Please provide repair concerns'],

    },
    technicianComments: {
      type:String, 
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    date_added: 
    {type: Date, 
      default: Date.now},
  },
  { timestamps: true }
)

module.exports = mongoose.model('Car', CarSchema)

