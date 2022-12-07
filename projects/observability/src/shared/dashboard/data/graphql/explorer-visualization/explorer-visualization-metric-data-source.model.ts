import { TimeDuration } from '@hypertrace/common';
import { Model } from '@hypertrace/hyperdash';
import { NEVER, Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import {
  ExploreRequestState,
  ExploreVisualizationRequest
} from '../../../../components/explore-query-editor/explore-visualization-builder';
import { GraphQlFilter } from '../../../../graphql/model/schema/filter/graphql-filter';
import { GraphQlTimeRange } from '../../../../graphql/model/schema/timerange/graphql-time-range';
import { ExploreGraphQlQueryHandlerService } from '../../../../graphql/request/handlers/explore/explore-graphql-query-handler.service';
import { GraphQlExploreRequest } from '../../../../graphql/request/handlers/explore/explore-query';
import { CartesianResult } from '../../../widgets/charts/cartesian-widget/cartesian-widget.model';
import { ExploreCartesianDataSourceModel, ExplorerData } from '../explore/explore-cartesian-data-source.model';
@Model({
  type: 'explorer-visualization-metric-data-source'
})
export class ExplorerVisualizationMetricDataSourceModel extends ExploreCartesianDataSourceModel {
  public request?: ExploreVisualizationRequest;

  protected fetchResults(): Observable<CartesianResult<ExplorerData>> {
    console.log('Calling fetchResults from extended class');

    if (this.request === undefined) {
      return NEVER;
    }

    return this.request.exploreQuery$.pipe(
      switchMap(exploreRequest => {
        const timeRange = this.getTimeRangeOrThrow();

        return this.query<ExploreGraphQlQueryHandlerService>(inheritedFilters =>
          this.appendFilters(exploreRequest, this.getFilters(inheritedFilters), timeRange)
        ).pipe(
          mergeMap(response => {
            console.log({ response });
            return this.mapResponseData(this.request!, response, exploreRequest.interval as TimeDuration, timeRange);
          })
        );
      })
    );
  }

  protected appendFilters(
    request: Omit<GraphQlExploreRequest, 'timeRange'>,
    filters: GraphQlFilter[],
    timeRange: GraphQlTimeRange
  ): GraphQlExploreRequest {
    return {
      ...request,
      timeRange: timeRange,
      filters: [...(request.filters ?? []), ...filters]
    };
  }

  protected buildRequestState(): ExploreRequestState | undefined {
    // Unused since fetchResults is overriden, but abstract so requires a def
    return undefined;
  }
}
