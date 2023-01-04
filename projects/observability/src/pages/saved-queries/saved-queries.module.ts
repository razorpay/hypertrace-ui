import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule, LinkModule, PageHeaderModule } from '@hypertrace/components';

import { SavedQueriesComponent } from './saved-queries.component';

@NgModule({
  imports: [CommonModule, PageHeaderModule, LinkModule, IconModule],
  declarations: [SavedQueriesComponent]
})
export class SavedQueriesModule {}
