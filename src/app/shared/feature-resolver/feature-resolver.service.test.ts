import { FeatureState } from '@hypertrace/common';
import { runFakeRxjs } from '@hypertrace/test-utils';
import { UiConfigurationService } from '../ui-configuration/ui-configuration.service';
import { FeatureResolverService } from './feature-resolver.service';

describe('Feature resolver service', () => {
  test('should enable all features', () => {
    runFakeRxjs(({ expectObservable }) => {
      const config = new UiConfigurationService();
      expect(new FeatureResolverService(config).getFeatureState('random'));
      expectObservable(new FeatureResolverService(config).getFeatureState('random')).toBe('(x|)', {
        x: FeatureState.Enabled
      });
    });
  });
});
