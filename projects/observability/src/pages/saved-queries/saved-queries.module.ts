import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@hypertrace/components';

import { SavedQueriesComponent } from './saved-queries.component';

@NgModule({
  imports: [CommonModule, PageHeaderModule],
  declarations: [SavedQueriesComponent]
})
// tslint:disable-next-line: no-unnecessary-class
export class SavedQueriesModule {}
