"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const canvasSchema = new mongoose_1.default.Schema({
    creatorId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number,
        default: Date.now
    }
});
const Canvas = mongoose_1.default.model('Canvas', canvasSchema);
exports.default = Canvas;
//# sourceMappingURL=Canvas.js.map