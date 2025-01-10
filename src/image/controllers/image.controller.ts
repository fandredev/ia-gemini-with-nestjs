import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtenstionImage, ImageService } from '../services/image.service';
import { ImageDTO } from '../dto/image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(\W|^)(png|jpeg|jpg)(\W|$)/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
          message: 'File too large',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() imageDTO: ImageDTO,
  ) {
    const extension = file.originalname.split('.').pop() as ExtenstionImage;

    return this.imageService.process(file.buffer, extension, imageDTO.prompt);
  }
}
