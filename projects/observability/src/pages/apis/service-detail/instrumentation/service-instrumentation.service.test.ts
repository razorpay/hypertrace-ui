import { ServiceInstrumentationService } from './service-instrumentation.service';

describe('ServiceInstrumentationService', () => {
  let service: ServiceInstrumentationService;
  beforeEach(() => {
    service = new ServiceInstrumentationService();
  });

  test('returns correct label for score', () => {
    expect(service.getLabelForScore(50)).toBe('Average');
  });

  test('returns correct color for score', () => {
    expect(service.getColorForScore(50).dark).toBe('#ffa01c');
  });

  test('returns correct description for score', () => {
    expect(service.getDescriptionForScore(50)).toBe(
      'There is considerable scope for improvement. Please see the sections below to learn how to improve the instrumentation of this service.'
    );
  });
});
