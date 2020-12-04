const express = require('express')
const router = express.Router()
const { registerValidations, userController } = require('../controllers/user-controller')

router.get('/register',  async (req,res,next) => {
    res.render('users/register', {
        title: 'Register',
        isRegisterActive: 'active'
    })
})

router.post('/register', registerValidations, async (req,res,next)=>{
    await userController.create(req, res, next)
})

router.get('/login', registerValidations, async (req,res,next) => {
    res.render('users/login', {
        title: 'Login',
        isLoginActive: 'active'
    })
})

router.post('/login', async (req, res,next) => {
   await userController.authenticate(req, res)
})

router.get('/logout', async (req,res,next) => {
    req.logout();
    res.redirect('/users/login');
})

router.get('/user_profile', async (req, res,next) => {
    await userController.userProfile(req, res)
})

router.post('/edit_profile', async (req, res,next) => {
    await userController.passwordChange(req, res, next)
})

router.get('/edit_profile', async (req, res,next) => {
    res.render('users/edit_profile', {
        title: 'Profile'
    })
})



module.exports = router;
