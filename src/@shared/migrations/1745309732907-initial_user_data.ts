/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@shared/entities/user.entity';

export class InitialUserData1745309732907 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const saltRounds = 10;
        const users = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                password: await bcrypt.hash('password123', saltRounds),
                role: 'admin',
                isActive: true,
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phone: '0987654321',
                password: await bcrypt.hash('password123', saltRounds),
                role: 'user',
                isActive: true,
            },
            {
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                phone: '1122334455',
                password: await bcrypt.hash('password123', saltRounds),
                role: 'user',
                isActive: true,
            },
            {
                firstName: 'Bob',
                lastName: 'Brown',
                email: 'bob.brown@example.com',
                phone: '2233445566',
                password: await bcrypt.hash('password123', saltRounds),
                role: 'moderator',
                isActive: true,
            },
            {
                firstName: 'Charlie',
                lastName: 'Davis',
                email: 'charlie.davis@example.com',
                phone: '3344556677',
                password: await bcrypt.hash('password123', saltRounds),
                role: 'admin',
                isActive: true,
            },
        ];

        const entityManager = queryRunner.manager;
        for (const user of users) {
            await entityManager.insert(User, {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                password: user.password,
                role: user.role,
                isActive: user.isActive,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const entityManager = queryRunner.manager;
        await entityManager.delete(User, {
            email: [
                'john.doe@example.com',
                'jane.smith@example.com',
                'alice.johnson@example.com',
                'bob.brown@example.com',
                'charlie.davis@example.com',
            ],
        });
    }
}
