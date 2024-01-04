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
const notesRouter = require('./routes/notesRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);



// 100 request per minute rate limiting
app.use(
    rateLimiter({
      windowMs: 1 * 60 * 1000,
      max: 100,
    })
  );
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));


app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
app.use('/api/notes', notesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.enable('trust proxy')
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    next(error)
  }
};

start();
