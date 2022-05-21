import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinkModule, LoadAsyncModule } from '@hypertrace/components';
import { CustomDashboardListComponent } from './custom-dashboards.component';

@NgModule({
  imports: [LinkModule, CommonModule, LoadAsyncModule],
  declarations: [CustomDashboardListComponent]
})
export class CustomDashboardListModule {}
