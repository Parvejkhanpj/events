const express = require("express");
const router = express.Router();
const {register,getAllUsers, login} = require('../controller/user')
const {Authrization} = require('../Auth/auth')


router.post('/register',Authrization, register)
router.post('/login', login)
router.get('/users',Authrization, getAllUsers)

module.exports = router;