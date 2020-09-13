"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shapeSchema = new mongoose_1.default.Schema({
    canvasId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    attributes: {
        type: Object,
        required: true
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
const Shape = mongoose_1.default.model('Shape', shapeSchema);
exports.default = Shape;
//# sourceMappingURL=Shape.js.map