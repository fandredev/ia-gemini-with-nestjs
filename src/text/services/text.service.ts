import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextDTO } from '../dto/text.dto';
import { SAFETY_SETTINGS } from 'src/config/constants/safety-settings';
import { DEFAULT_MODEL } from 'src/config/constants/model';
import { SYSTEM_INSTRUCTION } from 'src/config/constants/system-instruction';

const MODEL = DEFAULT_MODEL;

@Injectable()
export class TextService {
  protected genAI: GoogleGenerativeAI;
  protected model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const genAIKey = this.configService.get<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenerativeAI(genAIKey);

    this.model = this.genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: SAFETY_SETTINGS,
      systemInstruction: SYSTEM_INSTRUCTION,
    });
  }

  async createText({ prompt }: TextDTO) {
    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
      },
    });

    if (!result.response) {
      return new BadRequestException('Failed to generate content');
    }

    const responseGemini = result.response.text();

    return responseGemini;
  }
}
