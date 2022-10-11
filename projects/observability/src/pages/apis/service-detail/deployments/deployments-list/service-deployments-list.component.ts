import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  CoreTableCellRendererType,
  TableColumnConfig,
  TableDataResponse,
  TableDataSource,
  TableMode,
  TableStyle
} from '@hypertrace/components';

import { map } from 'rxjs/operators';
import { ServiceDeploymentsService } from '../service-deployments.service';
import { DeploymentsResponse, DeploymentsResponseRow } from '../service-deployments.types';

import { TimeRange } from '@hypertrace/common';

@Component({
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <ht-table
        [columnConfigs]="this.columnConfigs"
        [data]="this.dataSource$"
        [pageable]="false"
        [resizable]="false"
        mode=${TableMode.Detail}
        display=${TableStyle.Embedded}
        [detailContent]="childDetail"
      >
      </ht-table>
    </div>

    <ng-template #childDetail let-row="row">
      <ht-service-deployments-expanded-control
        [deploymentEndTime]="row.endTime"
      ></ht-service-deployments-expanded-control>
    </ng-template>
  `,
  selector: 'ht-service-deployments-list'
})
export class ServiceDeploymentsListComponent implements OnChanges {
  public constructor(private readonly serviceDeploymentsService: ServiceDeploymentsService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.timeRange?.currentValue !== undefined) {
      this.buildDataSource();
    }
  }

  @Input()
  public serviceName: string = '';

  @Input()
  public timeRange!: TimeRange;

  public columnConfigs: TableColumnConfig[] = [
    {
      id: 'commit',
      name: 'commit',
      title: 'Version',
      display: CoreTableCellRendererType.TextWithCopyAction,
      visible: true
    },
    {
      id: 'type',
      name: 'type',
      title: 'Type',
      display: CoreTableCellRendererType.Text,
      visible: true
    },
    {
      id: 'status',
      name: 'status',
      title: 'Status',
      display: CoreTableCellRendererType.Text,
      visible: true
    },
    {
      id: 'triggeredBy',
      name: 'triggeredBy',
      title: 'Triggered By',
      display: CoreTableCellRendererType.OpenInNewTab,
      rendererConfiguration: {
        showLinkText: true,
        openInNewTab: true,
        linkPrefix: 'https://github.com/'
      },
      visible: true
    },
    {
      id: 'startTime',
      name: 'startTime',
      title: 'Started At',
      display: CoreTableCellRendererType.Timestamp,
      visible: true,
      sortable: true
    },
    {
      id: 'endTime',
      name: 'endTime',
      title: 'Completed At',
      display: CoreTableCellRendererType.Timestamp,
      visible: true,
      sortable: true
    }
  ];

  public dataSource$?: TableDataSource<DeploymentsResponseRow>;

  public buildDataSource(): void {
    this.dataSource$ = {
      getData: () =>
        this.serviceDeploymentsService
          .getAllServiceDeployments(this.serviceName, this.timeRange)
          .pipe(map(res => this.formatResponseToTableFormat(res))),
      getScope: () => undefined
    };
  }

  private formatResponseToTableFormat(response: DeploymentsResponse): TableDataResponse<DeploymentsResponseRow> {
    return {
      data: response.payload.deployments ?? [],
      totalCount: response.payload.deployments?.length ?? 0
    };
  }
}
