// import mongoose from "mongoose";

// const meetingMinutesSchema = new mongoose.Schema({
//     meetingId: {
//         type: String,
//         required: true,
//     },
//     meetingTitle: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: String,
//         required: true,
//     },
//     time: {
//         type: String,
//         required: true,
//     },
//     location: {
//         type: String,
//         required: true,
//     },
//     attendees: {
//         type: String,
//         required: true,
//     },
//     decisions: [{
//         type: String,
//         required: true,
//     }],
//     actionItems: [{
//         type: String,
//         required: true,
//     }],
//     generatedAt: {
//         type: Date,
//         default: Date.now,
//     },
// }, {
//     timestamps: true,
// });

// export default mongoose.model("MeetingMinutes", meetingMinutesSchema);





// import mongoose from "mongoose";

// const meetingMinutesSchema = new mongoose.Schema({
// meetingId: {
// type: String,
// required: true,
// },
// meetingTitle: {
// type: String,
// required: true,
// },
// date: {
// type: String,
// required: true,
// },
// time: {
// type: String,
// required: true,
// },
// location: {
// type: String,
// required: true,
// },
// attendees: {
// type: String,
// required: true,
// },
// decisions: [{
// type: String,
// required: true,
// }],
// actionItems: [{
// type: String,
// required: true,
// }],



// // ✅ yahan add karo  
// minutesData: {  
//     type: mongoose.Schema.Types.Mixed,  
//     default: null,  
// },  
// generatedAt: {  
//     type: Date,  
//     default: Date.now,  
// },  
// }, {
// timestamps: true,
// });



// export default mongoose.model("MeetingMinutes", meetingMinutesSchema);








import mongoose from "mongoose";

const boardMemberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, default: "" },
  org: { type: String, default: "" },
  isFixed: { type: Boolean, default: false },
  image: { type: String, default: null }, // base64 or URL
});

const meetingMinutesSchema = new mongoose.Schema(
  {
    meetingId: { type: String, required: true },
    meetingTitle: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    attendees: { type: String, required: true },
    decisions: [{ type: String }],
    actionItems: [{ type: String }],

    // ✅ Board members (core + custom)
    boardMembers: { type: [boardMemberSchema], default: [] },

    // ✅ AI-generated minutes data
    minutesData: { type: mongoose.Schema.Types.Mixed, default: null },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("MeetingMinutes", meetingMinutesSchema);