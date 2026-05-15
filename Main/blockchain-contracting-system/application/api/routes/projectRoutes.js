'use strict';

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project routes
router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);

// Work package routes
router.post('/:id/workpackages', projectController.submitWorkPackage);
router.get('/:id/workpackages', projectController.getWorkPackages);

// Payment routes
router.post('/:id/payments', projectController.approvePayment);
router.get('/:id/payments', projectController.getPayments);

// Certification routes
router.post('/:id/certify', projectController.certifyWork);

// Audit trail
router.get('/:id/history', projectController.getProjectHistory);

module.exports = router;
