import { Client } from '@shared/entities/client.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialClientData1745313616743 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const clients = [
            {
                name: 'Client A',
                phone: '1234567890',
            },
            {
                name: 'Client B',
                phone: '0987654321',
            },
        ];

        for (const client of clients) {
            await queryRunner.manager.insert(Client, {
                name: client.name,
                phone: client.phone,
            });
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This method should reverse the changes made in the up() method.
        // For example, you might want to delete the inserted clients.
        await queryRunner.manager.delete(Client, {
            name: ['Client A', 'Client B'],
        });
    }
}
