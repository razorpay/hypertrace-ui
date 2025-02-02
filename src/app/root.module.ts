import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RudderStackTelemetry, UserTelemetryModule } from '@hypertrace/common';
import { ObservabilityDashboardModule } from '@hypertrace/observability';
import { ApplicationFrameModule } from './application-frame/application-frame.module';
import { ConfigModule } from './config.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './routes/root-routing.module';
import { NavigationModule } from './shared/navigation/navigation.module';

export type CustomWindow = Window &
  typeof globalThis & {
    analyticsConfig: {
      enabled: boolean;
      rudderstack_dataplane_url: string;
    };
    RUDDERSTACK_HT_WRITE_KEY: string;
  };

declare const window: CustomWindow;

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RootRoutingModule,
    ConfigModule,
    NavigationModule,
    HttpClientModule,
    ApplicationFrameModule,
    ObservabilityDashboardModule,
    UserTelemetryModule.forRoot([
      {
        telemetryProvider: RudderStackTelemetry,
        enableErrorTracking: true,
        enableEventTracking: true,
        enablePageTracking: true,
        initConfig: {
          writeKey: window.RUDDERSTACK_HT_WRITE_KEY
        }
      }
    ])
  ],
  declarations: [RootComponent],
  bootstrap: [RootComponent]
})
export class RootModule {}
