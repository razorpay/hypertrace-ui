import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NavigationParamsType, NavigationService, PreferenceService } from '@hypertrace/common';
import { SavedQuery } from '../explorer/explorer.component';

@Component({
  styleUrls: ['./saved-queries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="saved-queries">
      <ht-page-header class="explorer-header"></ht-page-header>
      <div class="query-list-container">
        <a *ngFor="let query of savedQueries" (click)="onClick(query)">
          <span *ngFor="let label of query.labels">{{ label }}</span>
        </a>
      </div>
    </div>
  `
})
export class SavedQueriesComponent implements OnDestroy {
  public savedQueries: SavedQuery[] = [];
  private readonly subscriptions: Subscription = new Subscription();

  public constructor(
    private readonly navigationService: NavigationService,
    private readonly preferenceService: PreferenceService
  ) {
    this.subscriptions.add(
      this.preferenceService.get('savedQueries', []).subscribe(queries => {
        this.savedQueries = queries as SavedQuery[];
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onClick(query: SavedQuery): void {
    this.navigationService.navigate({
      navType: NavigationParamsType.InApp,
      path: ['/explorer'],
      queryParams: {
        filter: query.filters,
        scope: query.scope
      }
    });
  }
}
