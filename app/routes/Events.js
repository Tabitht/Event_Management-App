const express = require('express');
const router = express.Router();
const EventControllers = require('./../controllers/EventControllers');
const validateRequest = require('./../middlewares/createEventValidator');
const authenticateuser = require('./../middlewares/authMiddleware');

router.get('/', EventControllers.getAll);

router.post('/', validateRequest, EventControllers.create);

router.get('/:id', EventControllers.get);

router.put('/:id', EventControllers.update);

router.delete('/:id', authenticateuser, EventControllers.Delete);

module.exports = router;