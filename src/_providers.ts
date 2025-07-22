import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { AuthService } from './features/_auth/auth.service';
import { UsersService } from './features/users/users.service';
import { EmailService } from '@shared/services/email.service';

const SERVICES = [AuthService, UsersService, EmailService];

const GUARDS = [JwtAuthGuard];

export const PROVIDERS = [...SERVICES, ...GUARDS];
