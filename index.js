const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const { prototype } = require("events");

app.use(express.json());
app.use(cors());

//database connection with mongodb
mongoose.connect("mongodb+srv://gulfarazfoxy11:GdRE3n78jhMeiXaJ@cluster0.wbffgcl.mongodb.net/e-commerce")

//api creation

app.get("/",(req,res)=>{
    res.send("Express app is running")

})

app.listen(port,(error)=>{

    if (!error) {
        console.log("server running on port"+port)
    }

    else 
    {
        console.log("Error :"+error)
    }

})


//creating the endpoint for registering user
app.post('/signup' ,async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,errors:"User already exists with same email address"})
    }
    let cart = {};
     for (let i = 0; i < 300; i++) {
        cart[i]=0;
     }
     const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,

     })

     await user.save();

     const data = {
        user:{
            id:user.id
        }
     }

     const token = jwt.sign(data,'secret_ecom');
     res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }

        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"wrong Email Id"})
    }
 })
