import { Injectable, Injector, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import { FixedTimeRange, TimeRangeService } from '../public-api';
import { Dictionary } from '../utilities/types/types';
import { UserTelemetryProvider, UserTelemetryRegistrationConfig, UserTraits } from './telemetry';
import { UserTelemetryService } from './user-telemetry.service';

@Injectable({ providedIn: 'root' })
export class UserTelemetryImplService extends UserTelemetryService {
  private allTelemetryProviders: UserTelemetryInternalConfig[] = [];
  private initializedTelemetryProviders: UserTelemetryInternalConfig[] = [];

  public constructor(private readonly injector: Injector, @Optional() private readonly router?: Router) {
    super();
    this.setupAutomaticPageTracking();
  }

  public register(...configs: UserTelemetryRegistrationConfig<unknown>[]): void {
    try {
      const providers = configs.map(config => this.buildTelemetryProvider(config));
      this.allTelemetryProviders = [...this.allTelemetryProviders, ...providers];
    } catch (error) {
      /**
       * Fail silently
       */

      // tslint:disable-next-line: no-console
      console.error(error);
    }
  }

  public initialize(): void {
    this.allTelemetryProviders.forEach(provider => provider.telemetryProvider.initialize(provider.initConfig));
    this.initializedTelemetryProviders = [...this.allTelemetryProviders];
  }

  public identify(userTraits: UserTraits): void {
    this.initializedTelemetryProviders.forEach(provider => provider.telemetryProvider.identify(userTraits));
  }

  public shutdown(): void {
    this.initializedTelemetryProviders.forEach(provider => provider.telemetryProvider.shutdown?.());
    this.initializedTelemetryProviders = [];
  }

  public trackEvent(name: string, data: Dictionary<unknown>): void {
    this.initializedTelemetryProviders
      .filter(provider => provider.enableEventTracking)
      .forEach(provider =>
        provider.telemetryProvider.trackEvent?.(name, { ...data, eventCategory: TelemetryEvent.click })
      );
  }

  public trackPageEvent(url: string, data: Dictionary<unknown>): void {
    this.initializedTelemetryProviders
      .filter(provider => provider.enablePageTracking)
      .forEach(provider =>
        provider.telemetryProvider.trackPage?.(url, { ...data, eventCategory: TelemetryEvent.navigate })
      );
  }

  public trackErrorEvent(error: string, data: Dictionary<unknown>): void {
    this.initializedTelemetryProviders
      .filter(provider => provider.enableErrorTracking)
      .forEach(provider =>
        provider.telemetryProvider.trackError?.(TelemetryEvent.error, {
          ...data,
          eventCategory: TelemetryEvent.error,
          errorMessage: error
        })
      );
  }

  private buildTelemetryProvider(config: UserTelemetryRegistrationConfig<unknown>): UserTelemetryInternalConfig {
    const providerInstance = this.injector.get(config.telemetryProvider);

    return {
      ...config,
      telemetryProvider: providerInstance
    };
  }

  private setupAutomaticPageTracking(): void {
    this.router?.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        delay(50)
      )
      .subscribe(route => {
        const queryParamMap = this.router?.routerState.snapshot.root.queryParamMap;
        const timeParamValue = queryParamMap?.get(TimeRangeService.TIME_RANGE_QUERY_PARAM);
        this.trackPageEvent(TelemetryEvent.navigate, {
          url: route.url,
          ...queryParamMap,
          isCustomTime: FixedTimeRange.isCustomTime(timeParamValue !== null ? timeParamValue : undefined)
        });
      });
  }
}

interface UserTelemetryInternalConfig<InitConfig = unknown> {
  telemetryProvider: UserTelemetryProvider<InitConfig>;
  initConfig: InitConfig;
  enablePageTracking: boolean;
  enableEventTracking: boolean;
  enableErrorTracking: boolean;
}

export enum TelemetryEvent {
  click = 'user-action',
  navigate = 'user-navigation',
  error = 'error'
}
