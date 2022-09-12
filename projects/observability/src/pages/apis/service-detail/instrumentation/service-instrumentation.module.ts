import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OrgScoreComponent, ProgressCircleComponent, TotalScoreComponent } from './components';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceInstrumentationComponent, TotalScoreComponent, ProgressCircleComponent, OrgScoreComponent],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
