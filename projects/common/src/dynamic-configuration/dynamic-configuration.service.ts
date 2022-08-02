import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DynamicConfigurationService {
  private config!: UiConfiguration;
  public constructor(private readonly http: HttpClient) {}
  public load(): void {
    this.http.get<UiConfiguration>('/assets/json/config.json').subscribe((data: UiConfiguration) => {
      this.config = data;
    });
  }
  public getValueForUrlConfig(key: string): string | undefined {
    console.log(this.config);

    return this.config?.urlConfig?.[key] as string;
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
