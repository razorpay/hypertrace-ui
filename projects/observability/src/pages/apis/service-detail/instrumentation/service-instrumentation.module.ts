import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { ProgressCircleComponent } from './components/progress-circle.component';
import { TotalScoreComponent } from './components/total-score.component';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule, NgCircleProgressModule.forRoot()],
  declarations: [ServiceInstrumentationComponent, TotalScoreComponent, ProgressCircleComponent],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
