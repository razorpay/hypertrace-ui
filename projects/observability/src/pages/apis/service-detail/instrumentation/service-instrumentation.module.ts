import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CategoryCardComponent, OrgScoreComponent, ProgressCircleComponent, TotalScoreComponent } from './components';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ServiceInstrumentationComponent,
    CategoryCardComponent,
    OrgScoreComponent,
    ProgressCircleComponent,
    TotalScoreComponent
  ],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
