const express = require('express');
const router = express.Router();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../schema/user");

router.get('/', (req, res, next) => {
    res.send('auth');
});

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            hashedPassword: hashedPassword
        });
        try {
            const result = await user.save();
            // res.status(201).send({
            //     message: 'Account created successfully',
            //     result
            // });
            req.flash('success', 'Account created successfully');
            res.status(201).redirect('/account/register');
            
        } catch (error) {
            // res.status(500).send({
            //     message: 'An error occured while trying to create the account',
            //     error
            // });
            req.flash('error', 'An error occured while trying to create the account');
            res.status(500).redirect('/account/register');
        }
    } catch (error) {
        // res.status(500).send({
        //     message: 'An error occured while trying to hash the password',
        //     error
        // });
        req.flash('error', 'An error occured while trying to hash the password');
        res.status(500).redirect('/account/register');
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            throw new Error('Email not found');
            // req.flash('error', 'Email not found');
            // res.status(400).redirect('/account/login');
        }
        try {
            const passwordCheck = await bcryptjs.compare(req.body.password, user.hashedPassword);

            if (passwordCheck) {
                const token = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h'
                    }
                );

                // res.cookie("auth_token", token, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === "production",
                //   }).status(200).send({
                //     message: 'Authentication successful',
                //     email: user.email,
                //     token
                // });

                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: true
                    // secure: process.env.NODE_ENV === "production"
                }).status(200).redirect('/');
            } else {
                // res.status(400).send({
                //     message: 'The password is incorrect',
                //     error
                // })
                req.flash('error', 'The password is incorrect');
                res.status(400).redirect('/account/login');
            }
        } catch (error) {
            // res.status(400).send({
            //     message: 'The password is incorrect',
            //     error
            // });
            req.flash('error', 'The password is incorrect');
            res.status(400).redirect('/account/login');
        }
    } catch (error) {
        // res.status(404).send({
        //     message: 'Could not find an account with the provided email address',
        //     error
        // });
        req.flash('error', 'Could not find an account associated with the provided email address');
        res.status(400).redirect('/account/login');
    }
});

module.exports = router;
