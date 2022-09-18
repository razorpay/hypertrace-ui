import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule, ProgressCircleModule } from '@hypertrace/components';
import { CategoryCardComponent, OrgScoreComponent, ProgressBarComponent, TotalScoreComponent } from './components';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [ButtonModule, CommonModule, ProgressCircleModule],
  declarations: [
    ServiceInstrumentationComponent,
    CategoryCardComponent,
    OrgScoreComponent,
    ProgressBarComponent,
    TotalScoreComponent
  ],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
