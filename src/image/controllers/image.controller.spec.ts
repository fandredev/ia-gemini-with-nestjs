import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from '../services/image.service';
import { Readable } from 'stream';

describe(`${ImageController.name}`, () => {
  let imageController: ImageController;
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: {
            process: jest.fn(),
          },
        },
      ],
    }).compile();

    imageController = module.get<ImageController>(ImageController);
    imageService = module.get<ImageService>(ImageService);
  });

  it('services and controller should be defined when module testing is created and compiled', () => {
    expect(imageController).toBeDefined();
    expect(imageService).toBeDefined();
  });

  describe(`Tests from ${ImageController.prototype.uploadFile.name}`, () => {
    it(`should call ${ImageService.prototype.process.name} when user tries to upload an image to gemini`, async () => {
      const file = {
        buffer: Buffer.from('image'),
        originalname: 'image.png',
        fieldname: 'file',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        path: 'path',
        destination: 'destination',
        stream: new Readable(),
        filename: 'image.png',
      };

      const fakeResponseModelGoogle = 'This city is so beautiful...';

      const imageDTO = {
        prompt: 'Please, describe this image.',
      };

      jest
        .spyOn(imageService, 'process')
        .mockResolvedValue(fakeResponseModelGoogle);

      const process = await imageController.uploadFile(file, imageDTO);

      expect(process).toBe(fakeResponseModelGoogle);
      expect(imageService.process).toHaveBeenCalledWith(
        file.buffer,
        'png',
        imageDTO.prompt,
      );
    });
  });
});
