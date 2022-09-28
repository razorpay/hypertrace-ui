import { ServiceInstrumentationService } from './service-instrumentation.service';

describe('ServiceInstrumentationService', () => {
  let service: ServiceInstrumentationService;
  beforeEach(() => {
    service = new ServiceInstrumentationService();
  });

  test('returns correct label for score', () => {
    expect(service.getLabelForScore(50)).toBe('Average');
  });
});
