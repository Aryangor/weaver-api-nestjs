import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { User } from '@shared/entities/user.entity';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<UserModel[]> {
        const users = await this.userRepository.find();

        return users.map((user) => {
            return {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                is_active: user.is_active,
                last_login: user.last_login,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        });
    }

    async getUserById(id: number): Promise<UserModel> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            is_active: user.is_active,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }

    async upsertUser(user: UserModel): Promise<UserModel> {
        const existingUser = await this.userRepository.findOneBy({
            id: user.id,
        });

        // Update existing user
        if (existingUser) {
            // If the email has changed, validate the new email
            if (existingUser.email !== user.email) {
                await this._validateEmail(user.email);
            }

            existingUser.email = user.email;
            existingUser.first_name = user.first_name;
            existingUser.last_name = user.last_name;
            existingUser.phone = user.phone;
            existingUser.is_active = user.is_active;
            existingUser.updated_at = new Date();

            await this.userRepository.save(existingUser);
            return { ...user, updated_at: existingUser.updated_at };
        }

        // Validate the incoming user data
        await this._validateEmail(user.email);

        // Create new user
        const newUser = this.userRepository.create(user);
        const savedUser = await this.userRepository.save(newUser);
        return {
            ...user,
            id: savedUser.id,
            created_at: savedUser.created_at,
            updated_at: savedUser.updated_at,
        };
    }

    private async _validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Invalid email format');
        }

        //  check the uniqueness of the incoming email
        const emailExists = await this.userRepository.findOneBy({
            email: email,
        });

        if (emailExists) {
            throw new BadRequestException(
                'A user with this email already exists!',
            );
        }
    }
}
