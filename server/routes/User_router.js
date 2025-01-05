const express = require('express');
const {signup,login, verifyToken, getUser} = require("../controllers/user_controller")
const router = express.Router();


router.post('/signup', signup)//from controller we take signup
router.post('/login', login);
router.get('/verify',verifyToken,getUser) //from the token user is provided is used again to get the details
// we will make a new router for the verify token as we want that user  will be logged in till he is active and 
//one more property that if user refresh the page he have to login again to the site


  module.exports = router