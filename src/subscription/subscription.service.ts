import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Injectable, NotImplementedException } from "@nestjs/common";
import {SubscriptionRepository} from "./subscription.repository";
import {SubscriptionDto} from "./dto/subscription.dto";
import {UserRepository} from "../user/user.repository";
@Injectable()
export class SubscriptionService {
  constructor(private subscriptionRepository: SubscriptionRepository,
              private userRepository: UserRepository) {}

  async getAllSubscriptions(): Promise<SubscriptionDto[]> {
    return await this.subscriptionRepository.getSubscriptions({});
  }

  async getSubscriptionById(id: number): Promise<SubscriptionDto> {
    return await this.subscriptionRepository.getSubscriptions({where: {id}}).then(subscriptions => subscriptions[0]);
  }

  async createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionDto> {
    let email = data.email;
    let user = await this.userRepository.getUsers({where: {email}});
    // if user exists
    if (user.length > 0) {
      let sub = await this.subscriptionRepository.createSubscription({data});
      return await this.subscriptionRepository.updateSubscription({where: {id: sub.id}, data: {user: {connect: {id: user[0].id}}}});
    } else {
      return await this.subscriptionRepository.createSubscription({data});
    }
  }
  async deleteSubscription(id: number): Promise<SubscriptionDto> {
    return await this.subscriptionRepository.deleteSubscription({where: {id}});
  }
}
