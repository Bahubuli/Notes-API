require('dotenv').config();
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require('./db/connect');

//  routers
const authRouter = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 2);


// 100 request per minute rate limiting
app.use(
    rateLimiter({
      windowMs: 1 * 60 * 1000,
      max: 100,
    })
  );
app.use(helmet());
const corsOptions = {
    origin: [ 'http://localhost:5173', 'http://localhost:5174'], // Replace with your frontend domain
    credentials: true, // Enable credentials (cookies, authorization headers)
  };

app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));


app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
   console.log("can't connect to mongodb atlas")
  }
};

start();
