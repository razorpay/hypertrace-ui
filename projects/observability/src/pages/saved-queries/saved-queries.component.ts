import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { NavigationService, PreferenceService } from '@hypertrace/common';
import { DrilldownFilter, ExplorerService } from '../explorer/explorer-service';
import { SavedQuery } from '../explorer/explorer.component';

@Component({
  styleUrls: ['./saved-queries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="saved-queries">
      <ht-page-header></ht-page-header>
      <div class="query-list-container">
        <a *ngFor="let query of savedQueries$ | async" (click)="onClick(query)">
          <div class="name-container">
            <p class="query-name">Placeholder for name of the query</p>
            <p class="scope">{{ query.scopeQueryParam === 'spans' ? 'Spans' : 'Endpoint Traces' }}</p>
          </div>
          <div class="filters-container">
            <span *ngFor="let filter of query.filters">{{ filter.userString }}</span>
          </div>
        </a>
      </div>
      <p class="not-found-text" *ngIf="(savedQueries$ | async)?.length === 0">
        You haven't saved any queries! Go to Explorer page to save a query.
      </p>
    </div>
  `
})
export class SavedQueriesComponent implements OnDestroy {
  public savedQueries$: Observable<SavedQuery[]>;
  private readonly subscriptions: Subscription = new Subscription();

  public constructor(
    private readonly navigationService: NavigationService,
    private readonly preferenceService: PreferenceService,
    private readonly explorerService: ExplorerService
  ) {
    this.savedQueries$ = this.preferenceService.get('savedQueries', []);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onClick(query: SavedQuery): void {
    this.subscriptions.add(
      this.explorerService
        .buildNavParamsWithFilters(query.scopeQueryParam, query.filters as DrilldownFilter[])
        .subscribe(navParams => this.navigationService.navigate(navParams))
    );
  }
}
