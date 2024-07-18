const express = require('express');
const router = express.Router();
const EventControllers = require('./../controllers/EventControllers');
const validateRequest = require('./../middlewares/createEventValidator');
const authenticateuser = require('./../middlewares/authMiddleware');
const uploads = require('../../config/upload');

router.get('/events', authenticateuser, EventControllers.getAll);

router.post('/events', authenticateuser, uploads.single('eventImage'), validateRequest, EventControllers.create);

router.get('/events:id', authenticateuser, EventControllers.get);

router.put('/events:id', authenticateuser, EventControllers.update);

router.delete('/events:id', authenticateuser, EventControllers.Delete);

router.get('/events/image/:id', EventControllers.getImage)

module.exports = router;