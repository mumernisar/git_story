const express = require('express');
const loveController = require('../controllers/loveController');

const router = express.Router();

router.post('/', loveController.calculateCompatibility);

module.exports = router;

