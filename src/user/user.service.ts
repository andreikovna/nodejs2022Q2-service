import { Injectable } from '@nestjs/common';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValid, USER_ERRORS } from 'src/utils/constantsAndHelpers';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { id } = await this.userRepository.save(createUserDto);
    return this.userRepository.findOneByOrFail({ id });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    if (isValid(id)) {
      const user = this.userRepository.findOneBy({ id });
      if (user) {
        return user;
      } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (isValid(id)) {
      const updatedUser = await this.findOne(id);
      if (updatePasswordDto.oldPassword === updatedUser.password) {
        updatedUser.password = updatePasswordDto.newPassword;
        return await this.userRepository.save(updatedUser);
      } else {
        throw new ForbiddenException(USER_ERRORS.WRONG_PASSWORD);
      }
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }

  async remove(id: string) {
    if (isValid(id)) {
      const user = await this.findOne(id);
      if (user) {
        this.userRepository.remove(user);
        return;
      } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }
}
