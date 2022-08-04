import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IconType } from '@hypertrace/assets-library';
import { NavigationParams, SubscriptionLifecycle } from '@hypertrace/common';
import { DrilldownFilter, ExplorerService } from '../explorer/explorer-service';
import { SavedQuery } from '../explorer/explorer.component';
import { SavedQueriesService, SavedQueryResponse } from './saved-queries.service';

@Component({
  styleUrls: ['./saved-queries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubscriptionLifecycle, SavedQueriesService],
  template: `
    <div class="saved-queries">
      <ht-page-header></ht-page-header>
      <div class="query-list-container">
        <div class="query-container" *ngFor="let query of savedQueriesSubject | async">
          <div class="query-link-container">
            <ht-link [paramsOrUrl]="getExplorerNavigationParams$(query.Data) | async">
              <div class="query-link">
                <div class="name-container">
                  <p class="query-name">{{ query.Data.name }}</p>
                  <p class="scope">{{ query.Data.scopeQueryParam === 'spans' ? 'Spans' : 'Endpoint Traces' }}</p>
                </div>
                <div class="filters-container">
                  <span *ngFor="let filter of query.Data.filters">{{ filter.userString }}</span>
                </div>
              </div>
            </ht-link>
          </div>
          <div class="query-options-container">
            <ht-icon
              title="Rename"
              class="query-option-edit"
              icon="${IconType.Edit}"
              (click)="onRename(query.Id)"
            ></ht-icon>
            <ht-icon
              title="Delete"
              class="query-option-delete"
              icon="${IconType.Delete}"
              (click)="onDelete(query.Id)"
            ></ht-icon>
          </div>
        </div>
      </div>
      <p class="not-found-text" *ngIf="(savedQueriesSubject | async)?.length === 0">
        You haven't saved any queries! Go to Explorer page to save a query.
      </p>
    </div>
  `
})
export class SavedQueriesComponent {
  public savedQueriesSubject: BehaviorSubject<SavedQueryResponse[]> = new BehaviorSubject<SavedQueryResponse[]>([]);

  public constructor(
    private readonly explorerService: ExplorerService,
    private readonly subscriptionLifecycle: SubscriptionLifecycle,
    private readonly savedQueriesService: SavedQueriesService
  ) {
    this.subscriptionLifecycle.add(
      this.savedQueriesService.getAllQueries().subscribe((queries: SavedQueryResponse[]) => {
        this.savedQueriesSubject.next(queries);
      })
    );
  }

  public getExplorerNavigationParams$(query: SavedQuery): Observable<NavigationParams> {
    return this.explorerService.buildNavParamsWithFilters(query.scopeQueryParam, query.filters as DrilldownFilter[]);
  }

  public onRename(queryId: number): void {
    const query: SavedQueryResponse = this.savedQueriesSubject
      .getValue()
      .find(savedQuery => savedQuery.Id === queryId)!;
    const queryData: SavedQuery = query.Data;
    const queryName = prompt('Enter a new name for this query', queryData.name);
    if (queryName !== null) {
      queryData.name = queryName;
      this.subscriptionLifecycle.add(this.savedQueriesService.updateQueryById(queryId, queryData).subscribe());
    }
  }

  public onDelete(queryId: number): void {
    if (confirm('Are you sure you want to delete this query?')) {
      this.subscriptionLifecycle.add(
        this.savedQueriesService.deleteQueryById(queryId).subscribe(response => {
          if (response.success) {
            this.savedQueriesSubject.next(
              this.savedQueriesSubject.getValue().filter((savedQuery: SavedQueryResponse) => savedQuery.Id !== queryId)
            );
          }
        })
      );
    }
  }
}
