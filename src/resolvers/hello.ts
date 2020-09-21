import { Resolver, Query, Subscription, PubSub, PubSubEngine, Root } from "type-graphql";

@Resolver()
export class HelloResolver {
  
  @Query(() => String)
  hello(@PubSub() pubsub: PubSubEngine) {
    pubsub.publish('TEST_SUBSCRIPTION', 'hello subscription')
    return "hello world"
  }

  @Subscription({
    topics: "TEST_SUBSCRIPTION"
  })
  helloSubscription(
    @Root() notificationPayload: string,
  ): string {
    return  'hello subscription'
  }
  
}