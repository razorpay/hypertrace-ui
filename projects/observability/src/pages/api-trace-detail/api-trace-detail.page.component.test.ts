import { createComponentFactory, mockProvider } from '@ngneat/spectator';
import { LoadAsyncModule } from '@hypertrace/components';
import { MemoizeModule, NavigationService } from '@hypertrace/common';

import { ApiTraceDetailPageComponent } from './api-trace-detail.page.component';
import { ExplorerService } from '../explorer/explorer-service';
import { MockComponent } from 'ng-mocks';
import { ExploreFilterLinkComponent } from '../../shared/components/explore-filter-link/explore-filter-link.component';
import { ApiTraceDetails, ApiTraceDetailService } from './api-trace-detail.service';
import { RouterTestingModule } from '@angular/router/testing';
import { mockDashboardWidgetProviders } from '../../../../dashboards/src/test/dashboard-verification';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('Trace Details Page Component', () => {
  const mockModel = {
    getData: jest.fn(() => of([{}]))
  };

  const mockApiServiceDetails: ApiTraceDetails = {
    id: '123',
    traceId: '123',
    type: 'string',
    timeString: '123',
    titleString: '123',
    startTime: 'string | number'
  };

  const createComponent = createComponentFactory<ApiTraceDetailPageComponent>({
    component: ApiTraceDetailPageComponent,
    shallow: true,
    imports: [LoadAsyncModule, MemoizeModule, RouterTestingModule, HttpClientTestingModule],
    providers: [
      ...mockDashboardWidgetProviders(mockModel),
      mockProvider(ApiTraceDetailService, {
        fetchTraceDetails: jest.fn().mockReturnValue(of(mockApiServiceDetails))
      }),
      mockProvider(ExplorerService),
      mockProvider(NavigationService)
    ],
    declarations: [MockComponent(ExploreFilterLinkComponent)]
  });

  it('renders component', () => {
    const spectator = createComponent();

    expect(spectator.query('div')).toHaveClass('trace-detail');
  });
});
