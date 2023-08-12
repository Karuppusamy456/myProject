if(process.env.NODE_ENV!='production'){
  require('dotenv').config();
}
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializepassport = require('./passport-config.js');

initializepassport(passport,
  email=>users.find(user=>user.email===email),
  (id)=>users.find(user=>user.id === id));

const app = express();

const users =[];//this is our local list for our users.

// app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));//Directly get the data from the form
app.use(flash());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave :false,
  saveUninitialized:false
}));
app.use(passport.initialize());

app.get("/",checkAuthenticated,(req,res)=>{
  res.render("index",{name:"karuppu"});
});

app.get('/Login',(req,res)=>{
    res.render('login.ejs');
});

app.post("/login",passport.authenticate("local",{
  successRedirect:'/',
  failureRedirect:"/login",
  failureFlash:true

})
);

app.get('/Register',(req,res)=>{
    res.render('register.ejs');
});

app.post('/register',async (req,res)=>{

  try{
    const hasedPassword = await bcrypt.hash(req.body.password,10);//if it is failed catch block will run and reload the register page itself.
    users.push(
      {
        id:Date.now().toString(),
        name:req.body.name ,
        email:req.body.email ,
        password:hasedPassword
      }
    );
    res.redirect("/login");
  }

catch{
  res.redirect("/register");
}
console.log(users);
});
function checkAuthenticated (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else
  res.redirect("/login");

}

app.listen(3000);// Server created this port Number