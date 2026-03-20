import * as Classes from './classes';

describe('classes', () => {
  describe('cn', () => {
    test('concatenate multiple strings', () => {
      const concatStrings = Classes.cn('class1', 'class2');

      expect(concatStrings).toBe('class1 class2');
    });

    test('handle undefined with empty', () => {
      const concatStrings = Classes.cn('class1', undefined, 'class3');

      expect(concatStrings).toBe('class1 class3');
    });
  });
});
