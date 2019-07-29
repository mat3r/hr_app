const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
 
/********************************
 * Test route starts with /api
 ********************************/

router.get('/projects/:sectCode&:projCode&:featured&:awarded&:success', apiController.getController);
//router.get('/ug/:code?', apiController.getController);
 
module.exports = router;
