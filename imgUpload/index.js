require('dotenv').config();
const port = process.env.PORT;

const express = require("express");
const app = express();
const path = require("path");


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})