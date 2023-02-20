import { Injectable } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { USER_ERRORS } from 'src/utils/constantsAndHelpers';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { id } = await this.userRepository.save(createUserDto);
    const response = await this.userRepository.findOneByOrFail({ id });
    delete response.password;
    return response;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const updatedUser = await this.findOne(id);
    if (updatePasswordDto.oldPassword === updatedUser.password) {
      updatedUser.password = updatePasswordDto.newPassword;
      const { id } = await this.userRepository.save(updatedUser);
      const response = await this.userRepository.findOneByOrFail({ id });
      delete response.password;
      return response;
    } else {
      throw new ForbiddenException(USER_ERRORS.WRONG_PASSWORD);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
      return;
    } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
  }
}
