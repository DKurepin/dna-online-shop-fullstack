import { PrismaService } from '../prisma.service';
import {Injectable, NotFoundException, NotImplementedException, Param, Res} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserDto} from "./dto/user.dto";
import {UserRepository} from "./user.repository";

@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userRepository.getUsers({});
  }

  async getUserById(id: number): Promise<UserDto> {
    return await this.userRepository.getUsers({where: {id}}).then(users => users[0]);
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
      return await this.userRepository.createUser({data});
  }

  async updateUser(data: UpdateUserDto): Promise<UserDto> {
    return await this.userRepository.updateUser({where: {id: data.id}, data});
  }

  async deleteUser(id: number): Promise<void> {
        this.userRepository.deleteUser({where: {id}});
  }

  async loginUser(email: string, password: string) {
    let user = await this.userRepository.getUsers({
        where: {
            email: email,
            password: password
        }
    })
    if (user.length === 0) {
        throw new NotFoundException('User not found')
    }

    user[0].password = ''
    return user[0]
  }

  async logoutUser() {
    return {message: 'Logged out'}
  }

  async findOne(email: string): Promise<UserDto> {
      return await this.userRepository.findOne({where: {email}});
  }
}
