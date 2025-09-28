require('dotenv').config();
require('express-async-errors');


//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')



const express = require('express');
const app = express();

//connectDB
const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication');
const authenticateRole = require('./middleware/check-role');



//routers 
const authRouter = require('./routes/auth');
const carsRouter = require('./routes/cars');
const adminRouter = require('./routes/admin');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 *1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
  );
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://virtual-garage-front.vercel.app'],  // The URL of your frontend app
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'], // Allowed methods
  credentials: true, // Allow credentials if needed (e.g., cookies)
}
));
app.use(xss());

/*
app.get('/', (req, res) => {
  res.send('cars api')
})*/

app.use(express.static('public'))

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cars',authenticateUser,  carsRouter);
app.use('/api/v1/admin', authenticateUser, authenticateRole, adminRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
