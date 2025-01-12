import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { TextService } from '../services/text.service';
import { TextDTO } from '../dto/text.dto';
import { BadRequestException } from '@nestjs/common';

describe(`${TextController.name}`, () => {
  let textController: TextController;
  let textService: TextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        {
          provide: TextService,
          useValue: {
            createText: jest.fn(),
          },
        },
      ],
    }).compile();

    textController = module.get<TextController>(TextController);
    textService = module.get<TextService>(TextService);
  });

  it('services and controller should be defined when module testing is created and compiled', () => {
    expect(textController).toBeDefined();
    expect(textService).toBeDefined();
  });

  describe(`Tests from ${TextController.prototype.questionToGemini.name}`, () => {
    it(`should call ${TextService.prototype.createText.name} when user tries to connect a conversation with google ai studio`, async () => {
      const textDTO: TextDTO = {
        prompt: 'Hello ChatGPT. How are you?',
      };

      const responseGemini = 'Hello! I am fine. How can I help you?';

      jest.spyOn(textService, 'createText').mockResolvedValue(responseGemini);

      const result = await textController.questionToGemini(textDTO);

      expect(result).toBe(responseGemini);
      expect(textService.createText).toHaveBeenCalledWith(textDTO);
    });

    it(`should throw an error when ${TextService.prototype.createText.name} fails to generate content`, async () => {
      const textDTO: TextDTO = {
        prompt: 'Hello ChatGPT. How are you?',
      };

      jest
        .spyOn(textService, 'createText')
        .mockRejectedValue(
          new BadRequestException('Failed to generate content'),
        );

      await expect(textController.questionToGemini(textDTO)).rejects.toThrow(
        new BadRequestException('Failed to generate content'),
      );
    });
  });
});
