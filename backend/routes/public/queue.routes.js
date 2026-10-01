const express = require('express');

const { getPublicQueue } = require('../../controllers/public/queue.controller');

const router = express.Router();

router.get('/', getPublicQueue);

module.exports = router;