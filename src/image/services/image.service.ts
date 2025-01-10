import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_MODEL } from 'src/config/constants/model';
import { SAFETY_SETTINGS } from 'src/config/constants/safety-settings';
import { SYSTEM_INSTRUCTION } from 'src/config/constants/system-instruction';

const MODEL = DEFAULT_MODEL;

export type ExtenstionImage = 'jpeg' | 'png' | 'jpg';

@Injectable()
export class ImageService {
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
  async process(buffer: Buffer, extension: ExtenstionImage, prompt: string) {
    const result = await this.model.generateContent([
      {
        inlineData: {
          data: Buffer.from(buffer).toString('base64'),
          mimeType: `image/${extension}`,
        },
      },
      prompt,
    ]);

    if (!result.response) {
      throw new BadRequestException('Failed to generate image caption');
    }

    return result.response.text();
  }
}
