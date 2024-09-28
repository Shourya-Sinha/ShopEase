import moment from "moment";
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    token: { type: String },
    ipAddress: { type: String, required: true },
    createdAt: { type: Date, default: moment().toDate() },
    isActive: { type: Boolean, default: true }
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;