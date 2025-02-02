import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import { isEqualIgnoreFunctions, NavigationService } from '@hypertrace/common';
import { ButtonRole, Filter, InputAppearance, ToggleItem } from '@hypertrace/components';
import {
  ExploreRequestState,
  ExploreVisualizationRequest
} from '../../../shared/components/explore-query-editor/explore-visualization-builder';
import { LegendPosition } from '../../../shared/components/legend/legend.component';
import { ExplorerVisualizationCartesianDataSourceModel } from '../../../shared/dashboard/data/graphql/explorer-visualization/explorer-visualization-cartesian-data-source.model';
import { ExplorerVisualizationMetricDataSourceModel } from '../../../shared/dashboard/data/graphql/explorer-visualization/explorer-visualization-metric-data-source.model';
import { AttributeMetadata } from '../../../shared/graphql/model/metadata/attribute-metadata';
import { ObservabilityTraceType } from '../../../shared/graphql/model/schema/observability-traces';
import { SPAN_SCOPE } from '../../../shared/graphql/model/schema/span';
import { MetadataService } from '../../../shared/services/metadata/metadata.service';
import { ExplorerGeneratedDashboard } from '../../explorer/explorer-dashboard-builder';
import { getLayoutForElements } from '../../explorer/utils/get-layout-for-elements';
import { CustomDashboardStoreService } from '../custom-dashboard-store.service';
import { CustomDashboardService } from '../custom-dashboard.service';

import type { ModelJson } from '@hypertrace/hyperdash';
import type { PanelData } from '../custom-dashboard-store.service'; // tslint:disable-line: no-duplicate-imports

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./custom-dashboard-edit.component.scss'],
  template: `
    <div class="dashboard-editor" *ngIf="state">
      <div class="header-container">
        <h3>
          {{ dashboardName }}/
          <ht-input
            type="string"
            class="panel-name-input"
            appearance="${InputAppearance.Border}"
            [value]="state.name"
            (valueChange)="this.onPanelNameChange($event)"
          >
          </ht-input>
        </h3>
      </div>
      <div class="visualization-container" *ngIf="this.visualizationDashboard$ | async as vizDashboard">
        <ht-application-aware-dashboard
          class="visualization-dashboard"
          [padding]="0"
          [json]="vizDashboard.json"
          (dashboardReady)="vizDashboard.onReady($event)"
        >
        </ht-application-aware-dashboard>
      </div>
      <ht-toggle-group
        class="context-data-toggle"
        [items]="this.contextItems"
        [activeItem]="this.currentContext"
        (activeItemChange)="this.onContextChange($event)"
      ></ht-toggle-group>
      <ht-filter-bar
        class="explorer-filter-bar"
        [attributes]="this.attributes$ | async"
        (filtersChange)="this.onFiltersUpdated($event)"
        [filters]="state.filters"
      ></ht-filter-bar>
      <ht-explore-query-editor
        [isExplorer]="false"
        [filters]="state.filters"
        [context]="state.context"
        [interval]="state.interval"
        [groupBy]="state.groupBy"
        [series]="state.series"
        [orderBy]="state.orderBy"
        (visualizationRequestChange)="this.onVisualizationRequestUpdated($event)"
      ></ht-explore-query-editor>
      <div class="button-group">
        <ht-button (click)="onSaveOrEditPanel()" class="save-btn" [label]="'Save Panel'" role="${ButtonRole.Additive}">
        </ht-button>
        <ht-button (click)="redirectToDashboard()" [label]="'Cancel'" role=" ${ButtonRole.Destructive}"> </ht-button>
      </div>
    </div>
  `
})
export class CustomDashboardPanelEditComponent {
  public attributes$: Observable<AttributeMetadata[]> = EMPTY;
  private readonly requestSubject: Subject<ExploreVisualizationRequest> = new ReplaySubject(1);

  private readonly cartesianWidgetJson: ModelJson = {
    type: 'cartesian-widget',
    'selectable-interval': false,
    'series-from-data': true,
    'legend-position': LegendPosition.Bottom,
    'selection-handler': {
      type: 'custom-dashboard-selection-handler'
    },
    'show-y-axis': true,
    'y-axis': {
      type: 'cartesian-axis',
      'show-grid-lines': true,
      'min-upper-limit': 25
    }
  };

  public state: PanelData = {
    context: ObservabilityTraceType.Api,
    resultLimit: 15,
    series: [],
    name: 'New Panel',
    id: '',
    isRealtime: false,
    interval: 'AUTO',
    json: this.cartesianWidgetJson
  };

  public filters: Filter[] = [];
  public visualizationDashboard$: Observable<ExplorerGeneratedDashboard>;
  public dashboardName: string = '';
  private dashboardView: string = '';
  public isNewPanel: boolean = false;
  public isNewDashboard: boolean = false;
  public dashboardId: string = '';
  public panelId: string = '';
  public currentContext: ToggleItem = {};
  public readonly contextItems: ToggleItem<string>[] = [
    {
      label: 'Endpoint Traces',
      value: ObservabilityTraceType.Api
    },
    {
      label: 'Spans',
      value: SPAN_SCOPE
    }
  ];

  public constructor(
    private readonly metadataService: MetadataService,
    private readonly activatedRoute: ActivatedRoute,
    protected readonly customDashboardStoreService: CustomDashboardStoreService,
    private readonly customDashboardService: CustomDashboardService,
    private readonly navigationService: NavigationService
  ) {
    const uniqueRequests$ = this.requestSubject.pipe(distinctUntilChanged(isEqualIgnoreFunctions));

    this.visualizationDashboard$ = uniqueRequests$.pipe(
      switchMap(request => this.buildVisualizationDashboard(request))
    );

    this.activatedRoute.params.subscribe(params => {
      this.isNewPanel = params.panel_id === 'new';
      this.panelId = params.panel_id;
      this.dashboardId = params.dashboard_id;
      this.dashboardView = params.dashboard_view;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.dashboardName = params.dashboardName;
      this.isNewDashboard = params.newDashboard.toLowerCase() === 'true';
    });

    const hasKey = this.customDashboardStoreService.hasKey(this.dashboardId);
    if (!hasKey) {
      // Fallback to listing incase user refereshes on panel edit page.
      // In that case, data is not present in the dashboard store since it's in memory.
      this.redirectToDashboard();

      return;
    }

    if (!this.isNewPanel) {
      const panelData = this.customDashboardStoreService.getPanel(this.dashboardId, this.panelId)!;
      this.state = panelData;
      this.state.interval = panelData.interval ?? ('NONE' as PanelData['interval']);
    }

    this.currentContext = this.contextItems.find(i => i.value === this.state.context)!;
    this.setFilters();
  }

  public onFiltersUpdated(newFilters: Filter[]): void {
    this.state.filters = [...newFilters];
  }

  public setFilters(): void {
    this.attributes$ = this.metadataService.getFilterAttributes(this.state.context);
  }

  public onPanelNameChange(name: string): void {
    this.state.name = name;
  }

  public onContextChange(context: ToggleItem<string>): void {
    this.state.context = context.value!;
    this.currentContext = this.contextItems.find(i => i.value === this.state.context)!;

    this.attributes$ = this.metadataService.getFilterAttributes(this.state.context);
  }

  private buildVisualizationDashboard(request: ExploreVisualizationRequest): Observable<ExplorerGeneratedDashboard> {
    if (request.interval === undefined && request.groupBy === undefined) {
      this.state.json = {
        type: 'container-widget',
        layout: getLayoutForElements(request.series?.length),
        children: request.series?.map(seriesObject => ({
          type: 'metric-display-widget',
          title: `${seriesObject.specification.name} ${seriesObject.specification.aggregation}`,
          subscript: seriesObject.specification.name === 'duration' ? 'ms' : undefined,
          'metric-key': seriesObject.specification.resultAlias()
        }))
      };

      return of({
        json: cloneDeep(this.state.json),
        onReady: dashboard => {
          dashboard.createAndSetRootDataFromModelClass(ExplorerVisualizationMetricDataSourceModel);
          const dataSource = dashboard.getRootDataSource<ExplorerVisualizationMetricDataSourceModel>()!;
          dataSource.request = request;
        }
      });
    }

    this.state.json = this.cartesianWidgetJson;

    return of({
      /*
       * The internal hda-dashboard components for rendering checks whether
       * we pass a new json object to trigger a the dashboardReady event
       * where we are handling the changes to filters and other fields.
       * Refer - https://github.com/razorpay/hypertrace-ui/pull/56#discussion_r937394346
       */
      json: cloneDeep(this.state.json),
      onReady: dashboard => {
        dashboard.createAndSetRootDataFromModelClass(ExplorerVisualizationCartesianDataSourceModel);
        const dataSource = dashboard.getRootDataSource<ExplorerVisualizationCartesianDataSourceModel>()!;
        dataSource.request = request;
      }
    });
  }
  public onVisualizationRequestUpdated(newRequest: ExploreVisualizationRequest): void {
    this.requestSubject.next(newRequest);
    this.state = {
      ...this.state,
      ...this.mapRequestToState(newRequest)
    };
  }

  private mapRequestToState(request: ExploreVisualizationRequest): ExploreRequestState {
    return {
      context: request.context,
      resultLimit: request.resultLimit,
      series: [...request.series],
      filters: request.filters && [...request.filters],
      interval: request.interval,
      groupBy: request.groupBy && { ...request.groupBy },
      orderBy: request.orderBy
    };
  }

  public onSaveOrEditPanel(): void {
    const panelSlug = this.customDashboardService.convertNameToSlug(this.state.name);
    if (this.isNewDashboard) {
      // In case of new dashboard, panel will also be new, so add a panel ID
      this.state.id = panelSlug;

      this.customDashboardService
        .createDashboard({
          id: this.dashboardId,
          name: this.dashboardName,
          panels: [this.state]
        })
        .subscribe(data => {
          this.dashboardId = data.payload.id;
          this.isNewDashboard = false;
          this.redirectToDashboard();
        });
    } else {
      if (this.isNewPanel) {
        this.state.id = panelSlug;
        this.customDashboardStoreService.addPanel(this.dashboardId, this.state);
      } else {
        this.customDashboardStoreService.updatePanel(this.dashboardId, this.state);
      }

      const dashboardData = this.customDashboardStoreService.get(this.dashboardId);

      this.customDashboardService.updateDashboard(this.dashboardId, dashboardData).subscribe(() => {
        this.redirectToDashboard();
      });
    }
  }

  public redirectToDashboard(): void {
    const dashboardId = this.isNewDashboard ? 'create' : this.dashboardId;
    this.navigationService.navigateWithinApp(['/custom-dashboards/', this.dashboardView, dashboardId]);
  }
}
