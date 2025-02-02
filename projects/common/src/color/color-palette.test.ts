import { ColorPalette } from './color-palette';

describe('Color palette', () => {
  test('should interpolate colors if requesting more colors than exist in the palette', () => {
    const colors = ['rgb(0, 0, 0)', 'rgb(100, 100, 100)'];
    expect(new ColorPalette(colors).forNColors(3)).toEqual([colors[0], 'rgb(50, 50, 50)', colors[1]]);
  });

  test('should return first color if one color requested', () => {
    const colors = ['rgb(1, 1, 1)', 'rgb(100, 100, 100)'];
    expect(new ColorPalette(colors).forNColors(1)).toEqual([colors[0]]);
  });

  test('should normalize colors to rgb', () => {
    const colors = ['black', 'white'];
    expect(new ColorPalette(colors).forNColors(2)).toEqual(['rgb(0, 0, 0)', 'rgb(255, 255, 255)']);
  });

  test('should return first and middle color if two colors requested from a larger palette', () => {
    const colors = ['rgb(0, 0, 0)', 'rgb(50, 50, 50)', 'rgb(100, 100, 100)'];
    expect(new ColorPalette(colors).forNColors(2)).toEqual([colors[0], colors[1]]);
  });

  test('should return exact colors if request matches palette size', () => {
    const colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'];
    expect(new ColorPalette(colors).forNColors(3)).toEqual(colors);
  });

  test('should throw an error if trying to build a palette for less than 2 colors', () => {
    expect(() => new ColorPalette([])).toThrow();
    expect(() => new ColorPalette(['black'])).toThrow();
    expect(() => new ColorPalette(['white', 'black'])).not.toThrow();
  });

  test('should return color combinations correctly', () => {
    const palette = new ColorPalette(['#fffbeb', '#140300']);
    expect(palette.getColorCombinations(2)).toEqual([
      {
        background: 'rgb(255, 251, 235)',
        foreground: '#080909'
      },
      {
        background: 'rgb(20, 3, 0)',
        foreground: '#FFFFFF'
      }
    ]);
  });

  test('should generate color for a string as expected from a limited set', () => {
    const palette = new ColorPalette(['#fffbeb', '#140300', '#789ab7']);
    expect(palette.getColorCombinationForId('test', 2)).toEqual({
      background: 'rgb(255, 251, 235)',
      foreground: '#080909'
    });
    expect(palette.getColorCombinationForId('test')).toEqual({
      background: 'rgb(20, 3, 0)',
      foreground: '#FFFFFF'
    });
  });
});
