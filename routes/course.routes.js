const express = require('express');
const courseController = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, authorize('superadmin', 'editor', 'viewer'), courseController.getCourses);
router.post('/', protect, authorize('superadmin', 'editor'), courseController.uploadCourse);
router.put('/:id', protect, authorize('superadmin', 'editor'), courseController.editCourse);
router.delete('/:id', protect, authorize('superadmin'), courseController.deleteCourse);

module.exports = router; 