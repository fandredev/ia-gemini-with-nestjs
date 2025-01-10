import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class TextDTO {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
