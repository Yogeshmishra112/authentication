const express = require('express')
//kCHUsIW0W3L3m5q8 password
const mongoose = require('mongoose');
const cors = require('cors');  // Import CORS
const cookieParser = require('cookie-parser')
const router = require("./routes/User_router.js")
//middleware is used 
 
const app = express(); 
app.use(cors({
    origin: 'http://localhost:3000',  // The origin you want to allow
    credentials: true,  // Allow credentials (cookies, Authorization headers, etc.)
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router); //after this route all the routes will be handled
mongoose.connect("").then(()=>{
    app.listen(5000);
    console.log("Database is connected and listening to port 5000 ");
    
 
}) 
.catch((err) => console.log(err)
);

  
