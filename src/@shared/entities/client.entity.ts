import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    phone: string;

    // @Column({ type: 'varchar', length: 255 })
    // address: string;

    @CreateDateColumn({ type: 'timestamp', precision: 0 })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 0 })
    updatedAt: Date;
}
