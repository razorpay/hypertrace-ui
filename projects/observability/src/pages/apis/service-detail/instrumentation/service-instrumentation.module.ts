import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { ProgressCircleComponent } from './components/progress-circle.component';
import { ProgressCircleComponent2 } from './components/progress-circle2.component';
import { TotalScoreComponent } from './components/total-score.component';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule, NgCircleProgressModule.forRoot()],
  declarations: [
    ServiceInstrumentationComponent,
    TotalScoreComponent,
    ProgressCircleComponent,
    ProgressCircleComponent2
  ],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
