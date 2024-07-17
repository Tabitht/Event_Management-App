const express = require('express');
const router = express.Router();
const EventControllers = require('./../controllers/EventControllers');
const validateRequest = require('./../middlewares/createEventValidator');
const authenticateuser = require('./../middlewares/authMiddleware');
const uploads = require('../../config/upload');

router.get('/', authenticateuser, EventControllers.getAll);

router.post('/', authenticateuser, uploads.single('eventImage'), validateRequest, EventControllers.create);

router.get('/:id', authenticateuser, EventControllers.get);

router.put('/:id', authenticateuser, EventControllers.update);

router.delete('/:id', authenticateuser, EventControllers.Delete);

router.get('/image/:id', EventControllers.getImage)

module.exports = router;