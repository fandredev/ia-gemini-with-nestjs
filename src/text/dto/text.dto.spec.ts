import { validate } from 'class-validator';
import { TextDTO } from './text.dto';

describe(`${TextDTO.name}`, () => {
  let textDto: TextDTO;

  beforeEach(async () => {
    textDto = new TextDTO();
  });

  it('dto should be defined when class is created and compiled', () => {
    expect(textDto).toBeDefined();
  });

  it('should validate DTO when he is not invalid', async () => {
    textDto.prompt = 'Please, describe this image.';
    const errors = await validate(textDto);
    expect(errors.length).toBe(0);
  });

  it('should failed DTO when prompt is empty', async () => {
    textDto.prompt = '';
    const errors = await validate(textDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('prompt');
  });

  it('should failed DTO when prompt is not a string', async () => {
    textDto.prompt = 1 as any;
    const errors = await validate(textDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('prompt');
  });
});
