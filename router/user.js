const {Router} = require('express');
const User = require('../models/user');


const router = Router();

router.get('/signin', (req,res) => {
    res.render('signin');
});

router.get('/signup', (req,res) => {
    res.render('signup');
});
router.get('/logout',(req,res) => {
   res.clearCookie('token');
   res.redirect('/');
})

router.post('/signin',async(req,res)=> {
    try{
         const {email,password } = req.body;
  const token = await User.matchPassword(email, password);
  res.cookie('token',token);
  res.redirect('/')

    }
    catch(err) {
        res.render("signin", {error:"Incorrect password"})
    }
 
});

router.post('/signup', async(req,res) => {
    try{
    const {fullname,email,password} = req.body;
    await User.create({
        fullname,
        email,
        password,
    });
    const token = await User.matchPassword(email, password);
     res.cookie('token',token);
    res.redirect('/');
}
catch(err){
    console.log(err);
     res.render("signup", {error:err})
}
});

module.exports = router;