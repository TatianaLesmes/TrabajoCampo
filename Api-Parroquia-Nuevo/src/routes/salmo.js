const express = require('express');
const router = express.Router();
const { obtener } = require('../controllers/salmoController');

router.get('/', obtener);

module.exports = router;
