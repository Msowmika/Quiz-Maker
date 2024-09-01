const express = require('express');
const router = express.Router();
const User = require('../schema/user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/',(req,res)=>{
    throw new Error('This is a forced error');
    res.send('login page')
})

router.post('/register', async(req,res)=>{
    try{
        const {name,email,password,confirmPassword} = req.body;
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).send('User already exists');
        }
        if(password !== confirmPassword){
           return  res.status(400).send('Passwords do not match')
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)

        const user = new User({
            name,
            email,
            password : hash,
           
        })
        await user.save();
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.json({
            email: user.email,
            token
        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json('Server error')
    }
    
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).send('Email and Password are required');
        }

        // Check if the user exists
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).send('Invalid credentials');
        }

        // Check if the password field is not undefined or null
        if (!userExists.password) {
            return res.status(500).send('Server error: Password is missing from the user record');
        }

        // Validate the password
        const validPass = bcrypt.compareSync(password, userExists.password);
        if (!validPass) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Send the response
        return res.status(200).json({
            email: userExists.email,
            token,
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});





module.exports = router;