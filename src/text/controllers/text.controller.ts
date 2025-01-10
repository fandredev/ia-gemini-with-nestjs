import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TextService } from '../services/text.service';
import { TextDTO } from '../dto/text.dto';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async questionToGemini(@Body() textDTO: TextDTO) {
    return this.textService.createText(textDTO);
  }
}
