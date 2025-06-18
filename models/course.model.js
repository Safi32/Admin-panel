const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timeManagement: { type: Number, required: true }, // in minutes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 