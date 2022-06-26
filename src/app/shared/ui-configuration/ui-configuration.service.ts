import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApplicationFeature } from '@hypertrace/common';
@Injectable({
  providedIn: 'root'
})
export class UiConfigurationService {
  private readonly config: UiConfiguration = window.___CONFIG;
  public constructor(@SkipSelf() @Optional() private readonly sharedService?: UiConfigurationService) {
    if (this.sharedService) {
      throw new Error('Config service already loaded');
    }
  }
  public isConfigPresentForFeature(feature: string): boolean {
    return this.config.featureFlags.hasOwnProperty(feature);
  }
  public getValueForFeature(feature: string): string | number | boolean {
    return this.config.featureFlags[feature];
  }
}

interface UiConfiguration {
  featureFlags: FlagsConfig;
  urlConfig: FlagsConfig;
  dashboardConfig: FlagsConfig;
}
interface FlagsConfig {
  [key: string]: string | boolean | number;
}
