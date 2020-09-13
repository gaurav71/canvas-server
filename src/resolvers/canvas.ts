import { Resolver, Mutation, Ctx, Arg, InputType, Field, Query, Maybe, FieldResolver, Root, Subscription, ObjectType, ID, UseMiddleware } from "type-graphql";
import Canvas from "../schemas/Canvas";
import { isAuth } from '../middlewares/auth'
import { MyContext } from "../types";
import User from "../schemas/User";

@ObjectType()
export class CanvasType {

  @Field(() => String)
  _id!: string;

  @Field(() => String)
  creatorId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => [String])
  members!: string[]

  @Field()
  createdAt!: number;

  @Field()
  updatedAt!: number;

}

@Resolver()
export class CanvasResolver {
  
  @UseMiddleware(isAuth)
  @Mutation(() => CanvasType)
  async createCanvas(@Arg('name') name: string, @Ctx() { req }: MyContext) {
    const canvas = new Canvas({ 
      creatorId: req.user,
      name: name 
    })
    console.log(canvas)
    await canvas.save()
    return canvas.toObject() as CanvasType
  }

  @UseMiddleware(isAuth)
  @Query(() => CanvasType, { nullable: true })
  async getCanvas(@Arg('_id') _id: string) {
    const canvas = await Canvas.findOne({ _id }).lean()
    console.log(canvas)
    return canvas
  }

  @UseMiddleware(isAuth)
  @Query(() => [CanvasType])
  async getAllCanvas(@Ctx() { req }: MyContext) {
    const canvas = await Canvas.find({ creatorId: req.user }).lean()
    return canvas
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteCanvas(@Arg('_id') _id: string) {
    await Canvas.findByIdAndDelete(_id)
    return true
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async addMemberToCanvas(@Arg('_id') _id: string, @Arg('userId') userId: string) {
    const canvas = await Canvas.findOne({ _id })

    if (!canvas) {
      throw new Error('No such canvas')
    }

    const user = await User.findOne({ _id: userId })

    if (!user) {
      throw new Error('No such user')
    }

    await Canvas.updateOne(
      { _id }, 
      { 
        $push: { members: userId }, 
        $set: { updatedAt: Date.now() } 
      }
    );

    await User.updateOne(
      { _id: userId }, 
      { 
        $push: { memberOfCanvas: _id }, 
        $set: { updatedAt: Date.now() } 
      }
    );

    return true
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeMemberFromCanvas(@Arg('_id') _id: string, @Arg('userId') userId: string) {
    const canvas = await Canvas.findOne({ _id })

    if (!canvas) {
      throw new Error('No such canvas')
    }

    const user = await User.findOne({ _id: userId })

    if (!user) {
      throw new Error('No such user')
    }

    await Canvas.updateOne(
      { _id }, 
      { 
        $pullAll: { members: [userId] }, 
        $set: { updatedAt: Date.now() } 
      }
    );

    await User.updateOne(
      { _id: userId }, 
      { 
        $pullAll: { memberOfCanvas: [_id] }, 
        $set: { updatedAt: Date.now() } 
      }
    );

    return true
  }
  
}
