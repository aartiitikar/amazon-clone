if(process.env.NODE_ENV != "prodution"){
    require("dotenv").config();
}

console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Signup = require("./model/signup.js");
const Login = require("./model/login.js")
const session = require("express-session");
const flash = require("connect-flash");


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(flash());

app.use(session({
     secret: "mySecretKey", // use a strong secret in production 
     resave: false, saveUninitialized: true 
}));

app.use((req, res, next) => { res.locals.success = req.flash("success"); res.locals.error = req.flash("error"); next(); });

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/test')
}


app.get("/users", (req,res)=>{
    res.send("this is users page");
})

app.get("/users/login", (req,res)=>{
    res.render("login");
})

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Signup.findOne({ email });
  if (user && user.password === password) {
    req.flash("success", "Logged in successfully!");
    res.redirect("/");
  } else {
    req.flash("error", "Invalid email or password");
    res.redirect("/users/login");
  }
});

app.get("/users/signup",(req,res)=>{
    res.render("signup");
})

app.post("/users/signup", async (req, res) => {
  try {
    const { number, fullName, email, password } = req.body;
    const newSignup = new Signup({ number, fullName, email, password });
    await newSignup.save();
    req.flash("success", "Signup successful!");
    res.redirect("/");
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", "Signup failed. Please try again.");
    res.redirect("/users/signup");
  }
});

app.get("/", (req,res)=>{
    res.render("home.ejs");
})

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
})