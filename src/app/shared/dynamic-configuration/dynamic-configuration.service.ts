import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DynamicConfigurationService {
  private config!: UiConfiguration;
  public constructor(
    private readonly http: HttpClient,
    @SkipSelf() @Optional() private readonly sharedService?: DynamicConfigurationService
  ) {
    if (this.sharedService) {
      throw new Error('Config service already loaded');
    }
  }

  public load(): Observable<UiConfiguration> {
    return this.http.get<UiConfiguration>('/assets/json/config.json').pipe(tap((data: UiConfiguration) => {
      this.config = data;
      this.setupAnalyticsConfig();
    }))
  }

  public isConfigPresentForFeature(feature: string): boolean {
    return this.config?.featureFlags?.hasOwnProperty(feature);
  }
  public getValueForFeature(feature: string): string | number | boolean {
    return this.config?.featureFlags?.[feature];
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
