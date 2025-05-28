import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '@shared/entities/user.entity';
import { InitialUserData1745309732907 } from '@shared/migrations/1745309732907-initial_user_data';
import { DataSourceOptions, DataSource } from 'typeorm';

export function fnDbConnection(): TypeOrmModuleOptions {
    return {
        type: 'mariadb', // or 'mysql', 'sqlite', etc.
        host: process.env.DB_HOST,
        port: (process.env.DB_PORT ?? 3306) as number,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        entities: ['dist/src/@shared/entities/*.entity{.ts,.js}'],

        migrationsTableName: '_migrations',
        migrations: ['dist/src/@shared/migrations/*{.ts,.js}'],
        migrationsRun: false, // Automatically run migrations on every application launch

        synchronize: true, // Disable in production
        //   ssl: this.isProduction(),
    };
}

const dataSource = new DataSource(fnDbConnection() as DataSourceOptions);

export default dataSource;
