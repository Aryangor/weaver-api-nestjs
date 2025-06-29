import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string | null;

    @Column({ type: 'varchar', length: 255 })
    first_name: string;

    @Column({ type: 'varchar', length: 255 })
    last_name: string;

    @Column({ type: 'varchar', length: 30 })
    phone: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', nullable: true })
    last_login: Date | null;

    // JWT for reset password
    @Column({ type: 'varchar', length: 255, nullable: true })
    reset_password_token: string | null;

    @CreateDateColumn({ type: 'timestamp', precision: 0 })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 0 })
    updated_at: Date;
}
