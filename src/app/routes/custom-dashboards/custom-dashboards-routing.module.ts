import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HtRoute } from '@hypertrace/common';
import {
  CustomDashboardComponent,
  CustomDashboardListComponent,
  CustomDashboardListModule,
  CustomDashboardModule,
  CustomDashboardService
} from '@hypertrace/observability';

const ROUTE_CONFIG: HtRoute[] = [
  {
    path: '',
    component: CustomDashboardListComponent
  },
  {
    path: `:${CustomDashboardService.API_ID_PARAM_NAME}`,
    component: CustomDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTE_CONFIG), CustomDashboardListModule, CustomDashboardModule]
})
export class CustomDashboardsRoutingModule {}
