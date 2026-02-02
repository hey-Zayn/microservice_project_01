const router = require('express').Router();
const authController = require('../controllers/auth.controller');


router.post('/sign-up', authController.signUp);
// router.post('/sign-in', authController.signIn);
// router.post('/sign-out', authController.signOut);


module.exports = router;