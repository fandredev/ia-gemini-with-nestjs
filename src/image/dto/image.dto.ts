import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class ImageDTO {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
