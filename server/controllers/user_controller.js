       
       const { response } = require("express");
       const User = require("../models/User")  //getting user from the user in model
       // Create a signup for each user
       const jwt = require('jsonwebtoken');
       const bcrypt = require('bcryptjs')
       const JWT_SECRETKEY = "mykey";
       const signup = async(req, res, next)=>{
            const {name, email, password}= req.body
            let existingUser ; //check for existing user
            try {
                existingUser = await User.findOne({email:email});
            } catch(err){ console.log(err);

            }
            if(existingUser){
                return res.status(400).json({message:"user already exist login instead"});
            }
            const hasedPassword = bcrypt.hashSync(password) //hashing of password 
            const user = new User({
                name, 
                email,
                password:hasedPassword
            });
       
        /* const signup=  async(req, res, next)=>{
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password 
            
        });*/     // simple method
        try {
            await user.save()//save in db
            
        } catch (error) {
            console.log(error);
             }
             return res.status(201).json({message: user}) //we will sent the response after the signup as a user
    
    };

    //login setup
    const login = async(req, res, next)=>{
        const { email, password}= req.body
        let existingUser ; //check for existing user
        try {
            existingUser = await User.findOne({email:email});
        } catch(err){ console.log(err);

        }
        if(!existingUser){
            return res.status(400).json({message:"user not found please signup"});
        }
        const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password)
        if (!isPasswordCorrect){
            return res.status(400).json({message:'invalid id/password'})
        }
        const token = jwt.sign({id: existingUser.id}, JWT_SECRETKEY ,{
          expiresIn: "30s"
        });

        //after the user logged in we use cookie parser
       res.cookie(String(existingUser._id), token, {   //we use it to provide the data to the frontend
        path:'/',
        expires: new Date(Date.now() + 1000*30),
        httpOnly: true, sameSite: 'lax' //by using httpOnly we make it secure from the user security high
    })
        return res.status(200).json({message:'sucessfully logged in', user:existingUser,token});
    };
        
    const verifyToken = async (req,res,next) => {
      //code after cookies
         const cookies = req.headers.cookie;
         const token = cookies.split("=")[1];
             console.log(token);
             /*  const headers = req.headers[`authorization`];
              //console.log(headers); we get the token with bearer so to separate it we use
              const token = headers.split(" ")[1]; */
              if(!token) {
                res.status(404).json({mesage:"No token found"});
              }
              //if exist we use jwt function to verify it
              jwt.verify(String(token),JWT_SECRETKEY,(err,user)=>
            {
                if(err){
                    return res.status(404).json({message:"Invalid message"});
                }
                console.log(user.id)
                req.id = user.id
            })
            next();
               
    };
    const getUser = async (req, res) => {
        const userId = req.id; // Retrieved from the token in the verifyToken middleware
      
        let user;
        try {
          user = await User.findById(userId, '-password');  // Exclude the password field
        } catch (err) {
          return res.status(500).json({ message: 'Server error' });
        }
      
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      
        // Make sure to send the user object, which includes the name
        return res.status(200).json({ user });
      };
      
 

   exports.signup = signup
   exports.login = login
   exports.verifyToken = verifyToken// this helps to verify the token of the user and we get the user id
   //controller is used to assign the functionality to the app


   //using the token we get the id of the user after the verification
   exports.getUser = getUser