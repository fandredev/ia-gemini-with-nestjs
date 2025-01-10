import { Body, Controller, Get } from '@nestjs/common';
import { TextService } from './text.service';
import { TextDTO } from './dto/text.dto';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get()
  public async questionToOpenAI(@Body() textDTO: TextDTO) {
    return this.textService.createText(textDTO);
  }
}
