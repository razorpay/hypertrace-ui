import { Injectable } from '@angular/core';
import { ApplicationFeature, FeatureState, FeatureStateResolver } from '@hypertrace/common';
import { Observable, of } from 'rxjs';
import { UiConfigurationService } from './../ui-configuration/ui-configuration.service';

@Injectable()
export class FeatureResolverService extends FeatureStateResolver {
  public constructor(private readonly uiConfigService: UiConfigurationService) {
    super();
  }
  public getFeatureState(flag: string): Observable<FeatureState> {
    return of(this.getConfigValue(flag as ApplicationFeature));
  }
  private getConfigValue(flag: ApplicationFeature): FeatureState {
    // Handle case where flag is not present in config.json
    if (this.uiConfigService.isConfigPresentForFeature(flag as string)) {
      return FeatureState.Enabled;
    }

    return this.uiConfigService.getValueForFeature(flag) ? FeatureState.Enabled : FeatureState.Disabled;
  }
}
