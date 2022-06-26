import { Injectable } from '@angular/core';
import { FeatureState, FeatureStateResolver } from '@hypertrace/common';
import { Observable, of } from 'rxjs';
import { UiConfigurationService } from './../ui-configuration/ui-configuration.service';

@Injectable()
export class FeatureResolverService extends FeatureStateResolver {
  public constructor(private readonly uiConfigService: UiConfigurationService) {
    super();
  }
  public getFeatureState(flag: string): Observable<FeatureState> {
    return of(this.getConfigValue(flag));
  }
  private getConfigValue(flag: string): FeatureState {
    // Handle case where flag is not present in config.json
    if (!this.uiConfigService.isConfigPresentForFeature(flag)) {
      return FeatureState.Enabled;
    }

    // tslint:disable-next-line: strict-boolean-expressions
    return this.uiConfigService.getValueForFeature(flag) ? FeatureState.Enabled : FeatureState.Disabled;
  }
}
