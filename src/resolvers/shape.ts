import { Resolver, Mutation, Ctx, Arg, InputType, Field, Query, Maybe, FieldResolver, Root, Subscription, ObjectType, ID, UseMiddleware } from "type-graphql";
import GraphQLJSON from 'graphql-type-json';

import Shape from '../schemas/Shape'
import { isAuth } from "../middlewares/auth";

@ObjectType()
export class ShapeType {

  @Field(() => String)
  _id!: string;

  @Field(() => String)
  canvasId!: string;

  @Field()
  type!: string;

  @Field({ nullable: true })
  text?: string;

  @Field(() => GraphQLJSON)
  attributes!: any;
  
  @Field()
  createdAt!: number;

  @Field()
  updatedAt!: number;

}


@InputType()
export class ShapeInput {

  @Field(() => String)
  canvasId!: string;

  @Field()
  type!: string;

  @Field({ nullable: true })
  text?: string;

  @Field(() => GraphQLJSON)
  attributes!: any;

}

@InputType()
export class UpdateShapeInput {

  @Field({ nullable: true })
  text?: string;

  @Field(() => GraphQLJSON)
  attributes!: any;

}

@Resolver()
export class ShapeResolver {

  @UseMiddleware(isAuth)
  @Mutation(() => ShapeType)
  async createShape(@Arg('input') input: ShapeInput) {
    const shape = new Shape({ ...input })
    await shape.save()
    return shape
  }

  @UseMiddleware(isAuth)
  @Query(() => ShapeType, { nullable: true })
  async getShape(@Arg('_id') _id: string) {
    const shape = await Shape.findOne({ _id })
    return shape
  }
  
  @UseMiddleware(isAuth)
  @Query(() => [ShapeType])
  async getShapes(@Arg('canvasId') canvasId: string) {
    return Shape.find({ canvasId })
  }

  @Mutation(() => ShapeType)
  async updateShape(@Arg('_id') _id: string, @Arg('input', () => UpdateShapeInput) input: UpdateShapeInput): Promise<ShapeType> {
    const shape = await Shape.updateOne({ _id }, { ...input })
    return shape
  }

  @Mutation(() => Boolean)
  async deleteShape(@Arg('_id') _id: string) {
    await Shape.findByIdAndDelete(_id)
    return true
  }

  @Mutation(() => Boolean)
  async deleteShapes(@Arg('canvasId') canvasId: string) {
    await Shape.deleteMany({ canvasId })
    return true
  }
  
}
