import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '@shared/entities/user.entity';

export class InitialUserData1745309732907 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const users: Partial<User>[] = [
            {
                first_name: 'SA',
                last_name: 'Tester',
                email: 'satester.38@gmail.com',
                phone: '1234567890',
                role: 'admin',
                is_active: true,
                password:
                    '$2b$10$45zsKi5joDa8jkXpusBaMeVNuJUSoTLoK82AV1BgUt.JMmkNpsd.2',
                last_login: null,
                reset_password_token: null,
            },
            {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane.smith@example.com',
                phone: '0987654321',
                role: 'user',
                is_active: true,
                password: null,
                last_login: null,
                reset_password_token: null,
            },
            {
                first_name: 'Alice',
                last_name: 'Johnson',
                email: 'alice.johnson@example.com',
                phone: '1122334455',
                role: 'user',
                is_active: true,
                password: null,
                last_login: null,
                reset_password_token: null,
            },
            {
                first_name: 'Bob',
                last_name: 'Brown',
                email: 'bob.brown@example.com',
                phone: '2233445566',
                role: 'user',
                is_active: true,
                password: null,
                last_login: null,
                reset_password_token: null,
            },
            {
                first_name: 'Charlie',
                last_name: 'Davis',
                email: 'charlie.davis@example.com',
                phone: '3344556677',
                role: 'admin',
                is_active: true,
                password: null,
                last_login: null,
                reset_password_token: null,
            },
        ];

        const entityManager = queryRunner.manager;
        for (const user of users) {
            await entityManager.insert(User, {
                ...user,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const entityManager = queryRunner.manager;
        await entityManager.delete(User, [
            { email: 'john.doe@example.com' },
            { email: 'jane.smith@example.com' },
            { email: 'alice.johnson@example.com' },
            { email: 'bob.brown@example.com' },
            { email: 'charlie.davis@example.com' },
        ]);
    }
}
