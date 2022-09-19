import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule, ProgressBarModule, ProgressCircleModule } from '@hypertrace/components';
import {
  CategoryCardComponent,
  CategoryDetailsComponent,
  OrgScoreComponent,
  ProgressBarComponent,
  TotalScoreComponent
} from './components';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [ButtonModule, CommonModule, ProgressBarModule, ProgressCircleModule],
  declarations: [
    ServiceInstrumentationComponent,
    CategoryCardComponent,
    CategoryDetailsComponent,
    OrgScoreComponent,
    ProgressBarComponent,
    TotalScoreComponent
  ],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
