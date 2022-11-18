const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require("crypto-js") 
const verify = require("../verifyToken")

//update user
router.put("/:id",verify, async(req, res) => {
    if(req.User.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set:req.body},{new:true});
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not authorized to update others users account");
    }
})

//Delete user
router.delete("/:id",verify, async(req, res) => {
    if(req.User.id === req.params.id || req.user.isAdmin){ 
        try {
            await User.findByIdAndUpdate(req.params.id);
            res.status(200).json("User has been deleted...");
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not authorized to delete others users account");
    }
})

//GET user
router.get("/find/:id",async(req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id);
            const { password,...other } = user._doc;
            res.status(200).json(other);
        } catch (error) {
            res.status(500).json(error)
        }
})

//GET ALL
router.get("/",verify, async(req, res) => {
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ?
            await User.find().sort({ _id: -1}).limit(5):
            await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not authorized to see all users");
    }
})

//GET USER STATS
router.get("/stats",async(req,res)=>{
    try {
        const data = await User.aggregate([
            {$project:{month:{$month:"$createdAt"}}},
            {$group:{id:"$month",total:{ $sum:1}}},
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports =router;