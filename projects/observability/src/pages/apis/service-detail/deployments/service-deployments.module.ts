import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadAsyncModule, SelectModule, TableModule, TimeRangeModule } from '@hypertrace/components';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import { NavigableDashboardModule } from '../../../../public-api';
import { ServiceDeploymentsExpandedControl } from './deployments-expanded-control/service-deployments-expanded-control.component';

import { ServiceDeploymentsListComponent } from './deployments-list/service-deployments-list.component';
import { ServicePostDeploymentMetrics } from './post-deployment-metrics/service-post-deployment-metrics.component';
import { ServiceDeploymentsComponent } from './service-deployments.component';
import { ServiceDeploymentsService } from './service-deployments.service';

@NgModule({
  imports: [
    CommonModule,
    LoadAsyncModule,
    TableModule,
    TimeRangeModule,
    SelectModule,
    DashboardCoreModule,
    NavigableDashboardModule
  ],
  declarations: [
    ServiceDeploymentsComponent,
    ServiceDeploymentsListComponent,
    ServiceDeploymentsExpandedControl,
    ServicePostDeploymentMetrics
  ],
  exports: [ServiceDeploymentsComponent],
  providers: [ServiceDeploymentsService]
})
export class ServiceDeploymentsModule {}
