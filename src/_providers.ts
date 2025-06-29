import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { AuthService } from './features/_auth/auth.service';
import { UsersService } from './features/users/users.service';

const SERVICES = [AuthService, UsersService];

const GUARDS = [JwtAuthGuard];

export const PROVIDERS = [...SERVICES, ...GUARDS];
