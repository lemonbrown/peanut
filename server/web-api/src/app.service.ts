import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {generateApiKey} from 'generate-api-key'

const PocketBase = require("pocketbase/cjs")

@Injectable()
export class AppService {

  constructor(private configService: ConfigService){}

  getHello(): string {
    return 'Hello World!';
  }

  getPocketBase(): typeof PocketBase {

    let pb = new PocketBase(this.configService.get<string>("POCKETBASE_URL"));

    pb.admins.authWithPassword(this.configService.get<string>("POCKETBASE_ADMIN_EMAIL"), this.configService.get<string>("POCKETBASE_ADMIN_PASSWORD"));

    return pb;

  }

  generateApiKey(): string {

    let key : any = generateApiKey();

    return key;

  }
}
