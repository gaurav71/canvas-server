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
exports.ShapeResolver = exports.UpdateShapeInput = exports.ShapeInput = exports.ShapeType = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const Shape_1 = __importDefault(require("../schemas/Shape"));
const auth_1 = require("../middlewares/auth");
let ShapeType = class ShapeType {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ShapeType.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ShapeType.prototype, "canvasId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShapeType.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ShapeType.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => graphql_type_json_1.default),
    __metadata("design:type", Object)
], ShapeType.prototype, "attributes", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ShapeType.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ShapeType.prototype, "updatedAt", void 0);
ShapeType = __decorate([
    type_graphql_1.ObjectType()
], ShapeType);
exports.ShapeType = ShapeType;
let ShapeInput = class ShapeInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ShapeInput.prototype, "canvasId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShapeInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ShapeInput.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => graphql_type_json_1.default),
    __metadata("design:type", Object)
], ShapeInput.prototype, "attributes", void 0);
ShapeInput = __decorate([
    type_graphql_1.InputType()
], ShapeInput);
exports.ShapeInput = ShapeInput;
let UpdateShapeInput = class UpdateShapeInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UpdateShapeInput.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => graphql_type_json_1.default),
    __metadata("design:type", Object)
], UpdateShapeInput.prototype, "attributes", void 0);
UpdateShapeInput = __decorate([
    type_graphql_1.InputType()
], UpdateShapeInput);
exports.UpdateShapeInput = UpdateShapeInput;
let ShapeResolver = class ShapeResolver {
    createShape(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const shape = new Shape_1.default(Object.assign({}, input));
            yield shape.save();
            return shape;
        });
    }
    getShape(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shape = yield Shape_1.default.findOne({ _id });
            return shape;
        });
    }
    getShapes(canvasId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Shape_1.default.find({ canvasId });
        });
    }
    updateShape(_id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const shape = yield Shape_1.default.findOneAndUpdate({ _id }, Object.assign({}, input)).lean();
            console.log(shape);
            return shape;
        });
    }
    deleteShape(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Shape_1.default.findByIdAndDelete(_id);
            return true;
        });
    }
    deleteShapes(canvasId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Shape_1.default.deleteMany({ canvasId });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Mutation(() => ShapeType),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ShapeInput]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "createShape", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Query(() => ShapeType, { nullable: true }),
    __param(0, type_graphql_1.Arg('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "getShape", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    type_graphql_1.Query(() => [ShapeType]),
    __param(0, type_graphql_1.Arg('canvasId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "getShapes", null);
__decorate([
    type_graphql_1.Mutation(() => ShapeType),
    __param(0, type_graphql_1.Arg('_id')), __param(1, type_graphql_1.Arg('input', () => UpdateShapeInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateShapeInput]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "updateShape", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "deleteShape", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('canvasId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShapeResolver.prototype, "deleteShapes", null);
ShapeResolver = __decorate([
    type_graphql_1.Resolver()
], ShapeResolver);
exports.ShapeResolver = ShapeResolver;
//# sourceMappingURL=shape.js.map