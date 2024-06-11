const express = require('express');
const router = express.Router();
const EventControllers = require('../controllers/EventControllers');

router.get('/', EventControllers.getAll);

router.post('/', EventControllers.create);

router.delete('/:id', EventControllers.Delete);

module.exports = router;