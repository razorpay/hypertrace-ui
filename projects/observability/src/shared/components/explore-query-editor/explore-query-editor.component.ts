import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TypedSimpleChanges } from '@hypertrace/common';
import { Filter } from '@hypertrace/components';
import { Observable } from 'rxjs';
import { AttributeExpression } from '../../graphql/model/attribute/attribute-expression';
import { GraphQlGroupBy } from '../../graphql/model/schema/groupby/graphql-group-by';
import { GraphQlSortDirection } from '../../graphql/model/schema/sort/graphql-sort-direction';
import { IntervalValue } from '../interval-select/interval-select.component';
import {
  ExploreRequestContext,
  ExploreSeries,
  ExploreVisualizationBuilder,
  ExploreVisualizationRequest
} from './explore-visualization-builder';

@Component({
  selector: 'ht-explore-query-editor',
  styleUrls: ['./explore-query-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExploreVisualizationBuilder],
  template: `
    <div *ngIf="this.visualizationRequest$ | async as currentVisualization" class="query-editor">
      <ht-explore-query-series-group-editor
        class="series-level-config"
        [series]="currentVisualization.series"
        [context]="currentVisualization.context"
        (seriesChange)="this.setSeries($event)"
        (addSeries)="this.addSeries()"
      ></ht-explore-query-series-group-editor>

      <div class="divider-container">
        <div class="divider"></div>
      </div>

      <div class="query-level-config">
        <ht-explore-query-interval-editor
          class="interval"
          [interval]="currentVisualization.interval"
          (intervalChange)="this.setInterval($event)"
        ></ht-explore-query-interval-editor>

        <ht-explore-query-group-by-editor
          class="group-by"
          [context]="currentVisualization.context"
          [groupByExpression]="(currentVisualization.groupBy?.keyExpressions)[0]"
          (groupByExpressionChange)="this.updateGroupByExpression(currentVisualization.groupBy, $event)"
        ></ht-explore-query-group-by-editor>
        <ht-explore-query-order-by-editor
          class="order-by"
          [currentOrderOption]="currentVisualization.orderBy"
          (orderByDirectionChange)="this.updateOrderBy($event)"
        ></ht-explore-query-order-by-editor>

        <ht-explore-query-limit-editor
          *ngIf="currentVisualization.groupBy"
          class="limit"
          [limit]="currentVisualization.groupBy?.limit"
          (limitChange)="this.updateGroupByLimit(currentVisualization.groupBy!, $event)"
          [includeRest]="currentVisualization.groupBy?.includeRest"
          (includeRestChange)="this.updateGroupByIncludeRest(currentVisualization.groupBy!, $event)"
        >
        </ht-explore-query-limit-editor>
      </div>
    </div>
  `
})
export class ExploreQueryEditorComponent implements OnChanges, OnInit {
  private static readonly DEFAULT_GROUP_LIMIT: number = 5;
  @Input()
  public isExplorer?: boolean = true;
  @Input()
  public filters?: Filter[];

  @Input()
  public context?: ExploreRequestContext;

  @Input()
  public series?: ExploreSeries[];

  @Input()
  public interval?: IntervalValue;

  @Input()
  public groupBy?: GraphQlGroupBy;

  @Input()
  public orderBy?: GraphQlSortDirection;

  @Output()
  public readonly visualizationRequestChange: EventEmitter<ExploreVisualizationRequest> = new EventEmitter();

  public readonly visualizationRequest$: Observable<ExploreVisualizationRequest>;

  public constructor(private readonly visualizationBuilder: ExploreVisualizationBuilder) {
    this.visualizationRequest$ = visualizationBuilder.visualizationRequest$;
  }

  public ngOnInit(): void {
    this.visualizationRequest$.subscribe(query => this.visualizationRequestChange.emit(query));
  }

  public ngOnChanges(changeObject: TypedSimpleChanges<this>): void {
    if (changeObject.context) {
      if (!this.isExplorer) {
        /* Context changes reset filters, for explorer we are able to preserve filters since
        they are part of the url, however for custom dashboards we have to get it from
        the old state and update the state again
        */
        const oldState = this.visualizationBuilder.currentState();
        this.visualizationBuilder.context(this.context);
        this.visualizationBuilder.filters(oldState.filters);
      } else {
        this.visualizationBuilder.context(this.context);
      }
    }

    if (changeObject.filters) {
      this.visualizationBuilder.filters(this.filters);
    }

    if (changeObject.series && this.series?.length) {
      this.setSeries(this.series);
    }

    if (changeObject.interval && this.interval) {
      this.setInterval(this.interval);
    }

    if (changeObject.groupBy && this.groupBy?.keyExpressions.length) {
      this.updateGroupByExpression(this.groupBy, this.groupBy.keyExpressions[0]);
    }
    if (changeObject.orderBy && this.orderBy) {
      this.updateOrderBy(this.orderBy);
    }
  }

  public setSeries(series: ExploreSeries[]): void {
    this.visualizationBuilder.setSeries(series);
  }

  public updateGroupByExpression(groupBy?: GraphQlGroupBy, keyExpression?: AttributeExpression): void {
    if (keyExpression === undefined) {
      this.visualizationBuilder.groupBy();
    } else {
      this.visualizationBuilder.groupBy(
        groupBy
          ? { ...groupBy, keyExpressions: [keyExpression] }
          : { keyExpressions: [keyExpression], limit: ExploreQueryEditorComponent.DEFAULT_GROUP_LIMIT }
      );
    }
  }

  public updateGroupByIncludeRest(groupBy: GraphQlGroupBy, includeRest: boolean): void {
    this.visualizationBuilder.groupBy({ ...groupBy, includeRest: includeRest });
  }

  public updateGroupByLimit(groupBy: GraphQlGroupBy, limit: number): void {
    this.visualizationBuilder.groupBy({ ...groupBy, limit: limit });
  }

  public updateOrderBy(orderBy?: GraphQlSortDirection): void {
    this.visualizationBuilder.orderBy(orderBy);
  }

  public setInterval(interval: IntervalValue): void {
    this.visualizationBuilder.interval(interval === 'NONE' ? undefined : interval);
  }

  public addSeries(): void {
    this.visualizationBuilder.addNewSeries();
  }
}
