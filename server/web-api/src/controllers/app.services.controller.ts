import { BadRequestException, Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AppService } from '../app.service';
import Pocketbase from 'pocketbase'
import { CreateMangaRequest } from '../Models/Request/CreateManga';
import { dataURItoBlob } from 'src/utils/dataUriHelper';
import { ConfigService } from '@nestjs/config';
import { AddChapterRequest } from 'src/Models/Request/AddChapter';
import { CreateServiceRequest } from 'src/Models/CreateService';

@Controller("service")
export class ServiceController {

    pb: Pocketbase;

  constructor(private readonly appService: AppService, private configService: ConfigService) {
    this.pb = appService.getPocketBase();
  }

  @Post()
  async createService(@Headers() headers: Record<string, string>, @Body() createServiceRequest: CreateServiceRequest): Promise<any>{

    let result: any;

    let apiKey: string = headers["x-api-key"];

    if(apiKey.length > 0){

        try{

            let appAccount  = await this.pb.collection("app_accounts").getFirstListItem('apikey="' + apiKey + '"');

            if(appAccount.permissions == "all"){

                let duplicate: Boolean = false;

                try{

                    let existingService = await this.pb.collection("services").getFirstListItem(`
                        email="${createServiceRequest.email}
                        && name="${createServiceRequest.name}"
                    `);

                    duplicate = true;
                }
                catch(exception){

                }

                if(!duplicate){

                    result = await this.pb.collection("services").create({
                        name: createServiceRequest.name,
                        email: createServiceRequest.email,
                        apikey: this.appService.generateApiKey()
                    });

                }else{

                    throw new BadRequestException("Duplicates are not allowed");
                }
            }
            else{

                throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
            }
        }catch(exception){

            throw new HttpException("Unable to authenticate", HttpStatus.BAD_REQUEST);
        }
    }
    else{

        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    return result;
  }



}
