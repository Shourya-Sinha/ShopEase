import express from 'express';
import cors from'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieSession from 'cookie-session';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import AuthRouter from './Routes/AuthRoute.js';
import BrandRouter from './Routes/BrandRoute.js';
import CategoryRouter from './Routes/CategoryRoute.js';
import ColorRouter from './Routes/ColorRoute.js';
import ProductRouter from './Routes/ProductRoute.js';
import AddressRouter from './Routes/AddressRoute.js'
import CouponRouter from './Routes/CouponRoute.js';
import handleAppError from './Utills/ErrorHnadler.js';
import path from 'path';
const __dirname = path.resolve();

dotenv.config();
const app = express();


const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3000,
    message: "Too many Requests from this IP, please try again in an hour!",
});

// Middlewares Start 
// app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net","https://fonts.googleapis.com",],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net","https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://fonts.googleapis.com","https://fonts.gstatic.com"],
      },
    })
  );
app.use(cors({
    // origin: "https://admin-ecom-9d97.onrender.com",
    // origin: ["http://localhost:5173"],
    origin: process.env.NODE_ENV === "Development" 
    ? "http://localhost:5173" 
    : "https://shopease-5jj5.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Custom-Header'],
}));

if(process.env.MODE_ENV === "Development"){
    app.use(morgan('dev'));
}
app.use("https://shopease-5jj5.onrender.com",limiter);
// app.use("http://localhost:5173",limiter);

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'default_secret_key'], // use a secret key from the environment variables or a default one
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(cookieParser());

app.use(xssClean());

  //Routes
app.use('/auth/user',AuthRouter);
app.use('/admin',BrandRouter);
app.use('/admin',CategoryRouter);
app.use('/admin',ColorRouter);
app.use('/admin',ProductRouter);
app.use('/user',AddressRouter);
app.use('/admin',CouponRouter);

app.use(handleAppError);

app.use(express.static(path.join(__dirname, 'user_frontend/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'user_frontend','dist','index.html'));
});

export default app;

