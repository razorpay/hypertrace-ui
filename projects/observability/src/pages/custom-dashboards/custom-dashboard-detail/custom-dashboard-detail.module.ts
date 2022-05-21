import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavigableDashboardModule } from '../../../shared/dashboard/dashboard-wrapper/navigable-dashboard.module';
import { ObservabilityDashboardModule } from '../../../shared/dashboard/observability-dashboard.module';
import { CustomDashboardComponent } from './custom-dashboard-detail.component';

@NgModule({
  imports: [CommonModule, ObservabilityDashboardModule, NavigableDashboardModule.withDefaultDashboards()],
  declarations: [CustomDashboardComponent]
})
export class CustomDashboardModule {}
