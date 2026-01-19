import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Silahkan akses /documentation untuk melihat Swagger UI.';
  }
}
