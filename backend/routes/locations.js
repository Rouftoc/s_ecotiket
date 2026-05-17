const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, locationController.getAllLocations);

router.get('/:id', authenticateToken, locationController.getLocationById);

router.post('/', authenticateToken, locationController.createLocation);

router.put('/:id', authenticateToken, locationController.updateLocation);

router.delete('/:id', authenticateToken, locationController.deleteLocation);

module.exports = router;