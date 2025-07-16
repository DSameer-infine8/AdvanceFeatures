require('dotenv').config();
const port = process.env.PORT;


const express = require("express");
const multer  = require('multer');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage })
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const session  = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('public/uploads'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const main = async() =>{
    await mongoose.connect("mongodb://127.0.0.1:27017/advance");
}

main()
.then(() => {console.log("Connection Successfull");})
.catch((err)=>{console.log(err)});

const sessionOpts = {
    secret:"mysupersecretstring", resave:false, saveUninitialized:true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 *24*60*60*1000,
        maxAge:  7 *24*60*60*1000
    }
};

app.use((session(sessionOpts)));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});


app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.post("/signup", upload.single('profilePic'),async(req,res)=>{
    try{
        let {firstName, lastName, email, password} = req.body;
        const profilePicPath = req.file ? `/uploads/${req.file.filename}` : null;
        const newUser = new User({username:email,firstName, lastName, email,profilePic: profilePicPath});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        console.log(req.file);
        req.flash("success", "user registered");
        res.redirect("/");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});


app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

app.post("/signin", passport.authenticate('local',{failureRedirect: '/signup', failureFlash:true} ),(req,res)=>{
    req.flash("success", "Welcome Back ,U have Signed-in");
    res.redirect("/");
});

app.get("/dash",(req,res)=>{
    res.render("dash.ejs");
})
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})