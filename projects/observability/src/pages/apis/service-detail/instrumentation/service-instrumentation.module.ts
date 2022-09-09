import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProgressCircleComponent } from './components/progress-circle.component';
import { TotalScoreComponent } from './components/total-score.component';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceInstrumentationComponent, TotalScoreComponent, ProgressCircleComponent],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
