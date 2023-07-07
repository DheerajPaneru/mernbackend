
import mysql from "mysql"
import express from "express"
import cors from "cors"
import multer from "multer";
import bodyparser from "body-parser"
import fetch from "node-fetch"
import jwt from "jsonwebtoken"
import { initClient } from "messagebird"
import bcrypt from "bcrypt"
//import Email1 from "./Email.js"
//YRvT31Q1REDqFeW1
//mongodb+srv://dheerajpaneru8:<YRvT31Q1REDqFeW1>@cluster0.y7lqa00.mongodb.net/taskusers
import crypto from "crypto"
import nodemailer from "nodemailer"
import { trusted } from "mongoose";
import cookieParser from "cookie-parser";
import { ok } from "assert";
import mongoose from "mongoose";
//import { timeStamp } from "console";
//import { TIME } from "mysql/lib/protocol/constants/types";
//import userSignup from "./userService.js";

//const mysql=require("mysql")
//const cors=require('cors')
//mysql connection
let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});
let app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(express.json())


//app.use(email)
//var jwt =require('jsonwebtoken')
//var upload = multer();
const messagebird = initClient('<YOUR_ACCESS_KEY>');
//require("dotenv").config();
//db.connect((err) => {
//   if (err) {
//       console.log("error");
//   }
//   else {
//       console.log("connected");
//   }
//})


//const mongoose = require('mongoose');
//require('./corn')
//const express=require('express')

app.use(bodyparser.urlencoded({ extended: true }))

//app.get("/",(req,res)=>{
//  res.json("hello backend")
//})
//app.use(Email1)
const port = process.env.PORT || 8000;
const jwtkey = "dheeraj";
//app.use(upload.array());
//image sorted
app.listen(port, () => {
    console.log(` hi dheeraj running  backend,${port}`);

})
//img filter


//app.post('/create', upload.array("products", 3), (req, res) => {

// const x = req.files;
// res.send(x)
// console.log(req.body.calss);
// console.log(x);


// const r ="INSERT INTO utable1 (photo)";
//  console.log(r,"ui");
//})
//app.use(cors({ origin:"*",methods:["POST","GET"], credentials:true}))
//app.use(cookieParser())

mongoose.set("strictQuery", false);

function check() {
    mongoose.connect('mongodb://127.0.0.1:27017/5678')
    console.log(' hi Connected!');
}
check()


//mongoose

const testSchema = new mongoose.Schema({
    email: String,
    password: String,
    type: String
})

const usertaskSchema = new mongoose.Schema({
    emailto: String,
    task: [{
        assigntaskto: String,
        typetask: String,
        tasktitle: String,
        assignby: String,
        status: Number,
        taskcontent: String,
        date: String,
        count:Number
    }]
})

const User = mongoose.model("users", testSchema)
const Usertask = mongoose.model("taskcollections", usertaskSchema)

app.post("/testmongodbsignup", async (req, res) => {
    try {
        //console.log(req)
        let user = new User();
        //  await User.insertMany(req.body)
        const y = req.body.user.email
        const x = await User.find({ email: y });
        //  console.log(x, "op")
        if (x.length == 0) {
            user.email = req.body.user.email;
            user.password = req.body.user.password;
            user.type = req.body.user.type;

            const doc = await user.save()
            res.status(200).json(doc)
            console.log(doc)
        }
        else {
            res.sendStatus(201)
        }
    }
    catch (err) {
        console.log(err)
    }
    // console.log(req)

})


app.post("/logintaskcheck", async (req, res) => {
    try {
        const y = req.body.user.email
        const t = req.body.user.password
        const x = await User.find({ email: y });
        console.log(x)
        if (x.length == 0) {
            res.sendStatus(201)
        }
        else {
            if (x[0].password == t) {
                res.send(x)
            }
            else {
                res.sendStatus(202)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
})


app.post("/taskmongodbassign", async (req, res) => {
    try {
        const t = JSON.parse(req.body.data)
        //console.log(req)
        let user = new Usertask();
        const f = req.body.usertask.assigntaskto
        const e = await Usertask.find({ emailto: f })
        console.log(e, "opi")

        if (e.length == 0) {
            user.emailto = req.body.usertask.assigntaskto;
            user.task = t;
            const doc = await user.save();
            res.send(doc)
        }
        else {
            const p = await Usertask.findOneAndUpdate({ emailto: req.body.usertask.assigntaskto }, { $push: { task: t } })
            // const x = JSON.parse(req.body.data)
            console.log(p, "p")

            res.sendStatus(203)
        }
        // const p = await Usertask.findOneAndUpdate({ emailto: req.body.usertask.assigntaskto }, { $push: { task: t } })
        // console.log(req)
        //  console.log(p, "p")

        //  console.log(JSON.parse(req.body.data))
        //   let user = new Usertask();
        // user.emailto = req.body.usertask.assigntaskto;
        //user.task = user.task.push(x)
        //const doc = await user.save()
        // res.send(x)
    }
    catch (err) {
        console.log(err)
    }
})

//taskfetch

app.get("/giventaskuser", async (req, res) => {
    try {
        const x = await Usertask.find({});
        res.json(x)
        //   console.log(x, "pppp")


    }
    catch (err) {
        console.log(err)

    }
})

app.get("/giventaskuserview/:id/:emailby/:emailto", async (req, res) => {
    try {
        const { id, emailby, emailto } = req.params;
        console.log(id, emailby, emailto)
        var x = await Usertask.find({ emailto: emailto });
        //   res.json(x)
        console.log(x, "pppp")
        const a = []
        for (let i = 0; i < x.length; i = i + 1) {
            const p = x[i].task.filter((c) => c.assignby == emailby)
            a.push(...p)
        }

        console.log(a, "iop")
        const p = a.filter((c) => c._id == id)
        console.log(p[0], 'op')
        res.send(p[0])

    }
    catch (err) {
        console.log(err)

    }
})







//-------
//fetchemaitaskuser
app.get("/taskuseremail", async (req, res) => {
    try {
        const x = await User.find({});
        res.json(x)
        console.log(x, "pppp")


    }
    catch (err) {
        console.log(err)

    }
})

app.get("/taskuseremailsingle/:emailsingle", async (req, res) => {
    try {
        const { emailsingle } = req.params
        const x = await Usertask.find({ emailto: emailsingle });
        res.json(x)
        console.log(x, "pppp")


    }
    catch (err) {
        console.log(err)

    }
})
//all data
app.get("/taskuseremailalldatatask", async (req, res) => {
    try {
        const { emailsingle } = req.params
        const x = await Usertask.find({});
        res.json(x)
        console.log(x, "pppp")


    }
    catch (err) {
        console.log(err)

    }
})




//delete dummy data
app.delete("/delte", async(req, res) => {
    try {

        await Usertask.deleteMany({})
    }
    catch (err) {
        console.log(err)
    }
})

app.put("/updatetask", async (req, res) => {
    try {

    }
    catch (err) {
        console.log(object)
    }
})
//test api

app.put("/edittaskuser/:id/:emailby/:emailto", async (req, res) => {
    try {
        console.log(req)
        const { id, emailby, emailto } = req.params;
        var x = await Usertask.find({ emailto: emailto });
        if (emailto == req.body.usertask.assigntaskto) {
            const updatedObject = await Usertask.findOneAndUpdate(
                { 'task._id': id },
                { $set: { 'task.$.typetask': req.body.usertask.typetask, 'task.$.taskcontent': req.body.usertask.taskcontent, 'task.$.tasktitle': req.body.usertask.tasktitle } },
                { new: true }
            );
            res.sendStatus(200)
        }
        else {
            await Usertask.updateOne({ emailto: emailto }, { $pull: { task: { _id: id } } });
            const t = JSON.parse(req.body.data)
            let user = new Usertask();
            user.emailto = req.body.usertask.assigntaskto;
            user.task = t;
            const doc = await user.save();
            res.send(doc)


        }
    }
    catch (err) {
        console.log(err)
    }


})
app.put("/edittaskuserstatus/:id/:emailby/:emailto", async (req, res) => {
    try {
        console.log(req)
        const { id, emailby, emailto } = req.params;
        //var x = await Usertask.find({ emailto: emailto });
            const updatedObject = await Usertask.findOneAndUpdate(
                { 'task._id': id },
                { $set: { 'task.$.status':1} },
                { new: true }
            );
            res.sendStatus(200)
        
       
        
    }
    catch (err) {
        console.log(err)
    }


})


app.delete("/deltetask/:id/:emailto", async (req, res) => {
    const { id, emailto } = req.params
    try {
        await Usertask.updateOne({ emailto: emailto }, { $pull: { task: { _id: id } } });
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
    }
})