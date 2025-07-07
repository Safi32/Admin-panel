const Course = require('../models/course.model');

exports.uploadCourse = async (req, res) => {
    try {
        const { courseName, pages, time } = req.body;
        const course = new Course({
            courseName,
            pages,
            time,
            uploadedBy: req.user ? req.user._id : null
        });
        await course.save();
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading course', error: error.message });
    }
};

exports.editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseName, pages, time } = req.body;
        const course = await Course.findByIdAndUpdate(
            id,
            { courseName, pages, time },
            { new: true }
        );
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error editing course', error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting course', error: error.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('uploadedBy', 'username email');
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
    }
}; 