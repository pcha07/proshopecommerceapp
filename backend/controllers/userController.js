import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import generateToken from '../utils/generateToken.js';


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) => {
    const {name,email,password} = req.body

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('User already exixts');
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data')
    }
})

// @desc    GET user profile
// @route   GET /api/users/profile
// @access  Ptivate
const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

// @desc    UPDATE user profile
// @route   PUT /api/users/profile
// @access  Ptivate
const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

// @desc    GET user 
// @route   GET /api/users
// @access  Ptivate/Admin
const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find({});
    res.status(200).json(users);
})



// @desc    DELETE user 
// @route   DELETE /api/users:id
// @access  Ptivate/Admin
const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    
    if(user) {
        await user.remove();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found')
    }
})

// @desc    GET user by ID
// @route   GET /api/users/:id
// @access  Ptivate/Admin
const getUserById = asyncHandler(async(req,res) => {
    const user = await User.findbyId(req.params.id).select('-password');
    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found')
    }
})


// @desc    UPDATE user
// @route   PUT /api/users/:id
// @access  Ptivate/Admin
const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save()

        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    deleteUser,
    getUsers,
    getUserById,
    updateUser,
}