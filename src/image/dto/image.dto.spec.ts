import { validate } from 'class-validator';
import { ImageDTO } from './image.dto';

describe(`${ImageDTO.name}`, () => {
  let imageDto: ImageDTO;

  beforeEach(async () => {
    imageDto = new ImageDTO();
  });

  it('dto should be defined when class is created and compiled', () => {
    expect(imageDto).toBeDefined();
  });

  it('should validate DTO when he is not invalid', async () => {
    imageDto.prompt = 'Please, describe this image.';
    const errors = await validate(imageDto);
    expect(errors.length).toBe(0);
  });

  it('should failed DTO when prompt is empty', async () => {
    imageDto.prompt = '';
    const errors = await validate(imageDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('prompt');
  });

  it('should failed DTO when prompt is not a string', async () => {
    imageDto.prompt = 1 as any;
    const errors = await validate(imageDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('prompt');
  });
});
