import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { AuthService } from './features/_auth/auth.service';
import { AppService } from './features/app/app.service';

const SERVICES = [AppService, AuthService];

const GUARDS = [JwtAuthGuard];

export const PROVIDERS = [...SERVICES, ...GUARDS];
