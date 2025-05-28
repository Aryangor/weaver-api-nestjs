import { execSync } from 'child_process';

const migrationName = process.argv[2];
if (!migrationName) {
    console.error('Please provide a migration name.');
    process.exit(1);
}

execSync(`npx typeorm migration:run --config db-config.ts`, {
    stdio: 'inherit',
});
