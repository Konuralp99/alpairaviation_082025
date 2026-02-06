const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

const { validateRequest } = require('../middleware/validators');
const { authenticateToken } = require('../middleware/auth');

router.get('/requests', authenticateToken, requestController.getAllRequests);
router.post('/request', validateRequest, requestController.createRequest);
router.patch('/requests/:id', authenticateToken, requestController.updateRequestStatus);

module.exports = router;
