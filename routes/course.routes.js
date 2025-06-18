const express = require('express');
const courseController = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all courses (Super Admin, Editor, Viewer)
router.get('/', protect, authorize('superadmin', 'editor', 'viewer'), courseController.getCourses);

// Upload course (Super Admin, Editor)
router.post('/', protect, authorize('superadmin', 'editor'), courseController.uploadCourse);

// Edit course (Super Admin, Editor)
router.put('/:id', protect, authorize('superadmin', 'editor'), courseController.editCourse);

// Delete course (Super Admin only)
router.delete('/:id', protect, authorize('superadmin'), courseController.deleteCourse);

module.exports = router; 