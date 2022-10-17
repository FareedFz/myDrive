const express = require('express')
const router = express.Router();
const userController=require('./controller/userController')
router.all('/register',userController.Register);
router.all('/login',userController.Login);
router.all('/createFolder',userController.createFolder);
router.all('/createFile',userController.createFile)



module.exports = router;