import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TotalScoreComponent } from './components/total-score.component';
import { ServiceInstrumentationComponent } from './service-instrumentation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceInstrumentationComponent, TotalScoreComponent],
  exports: [ServiceInstrumentationComponent]
})
export class ServiceInstrumentationModule {}
