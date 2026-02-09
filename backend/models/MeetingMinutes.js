import mongoose from "mongoose";

const meetingMinutesSchema = new mongoose.Schema({
    meetingId: {
        type: String,
        required: true,
    },
    meetingTitle: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    attendees: {
        type: String,
        required: true,
    },
    decisions: [{
        type: String,
        required: true,
    }],
    actionItems: [{
        type: String,
        required: true,
    }],
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export default mongoose.model("MeetingMinutes", meetingMinutesSchema);
