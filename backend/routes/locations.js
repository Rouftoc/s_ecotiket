const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.substring(7);

  req.user = { role: 'petugas' };
  next();
};

router.get('/', authenticate, locationController.getAllLocations);

router.get('/:id', authenticate, locationController.getLocationById);

router.post('/', authenticate, locationController.createLocation);

router.put('/:id', authenticate, locationController.updateLocation);

router.delete('/:id', authenticate, locationController.deleteLocation);

module.exports = router;