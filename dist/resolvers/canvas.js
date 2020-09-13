"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasResolver = exports.CanvasType = void 0;
const type_graphql_1 = require("type-graphql");
const Canvas_1 = __importDefault(require("../schemas/Canvas"));
const auth_1 = require("../middlewares/auth");
const User_1 = __importDefault(require("../schemas/User"));
let CanvasType = class CanvasType {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], CanvasType.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], CanvasType.prototype, "creatorId", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], CanvasType.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", Array)
], CanvasType.prototype, "members", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CanvasType.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CanvasType.prototype, "updatedAt", void 0);
CanvasType = __decorate([
    type_graphql_1.ObjectType()
], CanvasType);
exports.CanvasType = CanvasType;
let CanvasResolver = class CanvasResolver {
    createCanvas(name, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = new Canvas_1.default({
                creatorId: req.user,
                name: name
            });
            console.log(canvas);
            yield canvas.save();
            return canvas.toObject();
        });
    }
    getCanvas(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = yield Canvas_1.default.findOne({ _id }).lean();
            console.log(canvas);
            return canvas;
        });
    }
    getAllCanvas({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = yield Canvas_1.default.find({ creatorId: req.user }).lean();
            return canvas;
        });
    }
    deleteCanvas(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Canvas_1.default.findByIdAndDelete(_id);
            return true;
        });
    }
    addMemberToCanvas(_id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = yield Canvas_1.default.findOne({ _id });
            if (!canvas) {
                throw new Error('No such canvas');
            }
            const user = yield User_1.default.findOne({ _id: userId });
            if (!user) {
                throw new Error('No such user');
            }
            yield Canvas_1.default.updateOne({ _id }, {
                $push: { members: userId },
                $set: { updatedAt: Date.now() }
            });
            yield User_1.default.updateOne({ _id: userId }, {
                $push: { memberOfCanvas: _id },
                $set: { updatedAt: Date.now() }
            });
            return true;
        });
    }
    removeMemberFromCanvas(_id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = yield Canvas_1.default.findOne({ _id });
            if (!canvas) {
                throw new Error('No such canvas');
            }
            const user = yield User_1.default.findOne({ _id: userId });
            if (!user) {
                throw new Error('No such user');
            }
            yield Canvas_1.default.updateOne({ _id }, {
                $pullAll: { members: [userId] },
                $set: { updatedAt: Date.now() }
            });
            yield User_1.default.updateOne({ _id: userId }, {
                $pullAll: { memberOfCanvas: [_id] },
                $set: { updatedAt: Date.now() }
            });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Mutation(() => CanvasType),
    __param(0, type_graphql_1.Arg('name')), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "createCanvas", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Query(() => CanvasType, { nullable: true }),
    __param(0, type_graphql_1.Arg('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "getCanvas", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Query(() => [CanvasType]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "getAllCanvas", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "deleteCanvas", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('_id')), __param(1, type_graphql_1.Arg('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "addMemberToCanvas", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('_id')), __param(1, type_graphql_1.Arg('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CanvasResolver.prototype, "removeMemberFromCanvas", null);
CanvasResolver = __decorate([
    type_graphql_1.Resolver()
], CanvasResolver);
exports.CanvasResolver = CanvasResolver;
//# sourceMappingURL=canvas.js.map