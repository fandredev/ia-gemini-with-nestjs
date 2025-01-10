import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
} from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextDTO } from './dto/text.dto';

const MODEL = 'gemini-2.0-flash-exp';

@Injectable()
export class TextService {
  protected genAI: GoogleGenerativeAI;
  protected model: GenerativeModel;
  private readonly safetySettings: SafetySetting[] = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  constructor(private configService: ConfigService) {
    const genAIKey = this.configService.get<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenerativeAI(genAIKey);

    this.model = this.genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: this.safetySettings,
      systemInstruction: `
        'Your name is John. You are a specialist of mathematics and programming. 
        You have a lot of abilities about generals knowledge. 
        Always tries responding the user with the maximum information about the question. Be polite.
        In the first interaction, you can introduce yourself and ask the user's name.
        '
      `,
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
