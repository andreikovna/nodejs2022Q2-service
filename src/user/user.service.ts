import { Injectable } from '@nestjs/common';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { v4 } from 'uuid';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { db } from 'src/database/db';
import { isValid, USER_ERRORS } from 'src/utils/constantsAndHelpers';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: v4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.users.push(newUser);

    const result = { ...newUser };
    delete result.password;

    return result;
  }

  findAll() {
    return db.users;
  }

  findOne(id: string) {
    if (isValid(id)) {
      const user = db.users.find(user => user.id === id);
      if (user) {
        const response = { ...user };
        delete response.password;
        return response;
      } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (isValid(id)) {
      const index = db.users.findIndex(user => user.id === id);
      if (index !== -1) {
        const updatedUser = db.users[index];
        if (updatePasswordDto.oldPassword === updatedUser.password) {
          db.users[index] = {
            ...updatedUser,
            password: updatePasswordDto.newPassword,
            updatedAt: Date.now(),
            version: updatedUser.version + 1,
          };
          const response = { ...db.users[index] };
          delete response.password;
          return response;
        } else {
          throw new ForbiddenException(USER_ERRORS.WRONG_PASSWORD);
        }
      } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }

  remove(id: string) {
    if (isValid(id)) {
      const user = db.users.find(user => user.id === id);
      if (user) {
        db.users = db.users.filter(user => user.id !== id);
        return;
      } else throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    throw new BadRequestException(USER_ERRORS.INVALID_ID);
  }
}
