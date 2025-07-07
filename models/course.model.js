const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    pages: [
        {
            title: { type: String, required: true },
            content: { type: String, required: true },
            time: { type: Number, required: true } // in minutes
        }
    ],
    time: { type: Number, default: 0 }, // total course time in minutes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 