import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from '../../@shared/decorators/auth.decorator';

@Controller()
@Auth()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('test')
    getHello(): string {
        return this.appService.getHello();
    }
}
