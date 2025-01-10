import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextDTO } from './dto/text.dto';

const MODEL = 'gemini-1.5-flash';

@Injectable()
export class TextService {
  protected genAI: GoogleGenerativeAI;
  protected model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const genAIKey = this.configService.get<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenerativeAI(genAIKey);

    this.model = this.genAI.getGenerativeModel({
      model: MODEL,
    });
  }

  async createText({ prompt }: TextDTO) {
    const result = await this.model.generateContent(prompt);

    if (!result.response) {
      return new BadRequestException('Failed to generate content');
    }

    const responseGemini = result.response.text();

    return responseGemini;
  }
}
