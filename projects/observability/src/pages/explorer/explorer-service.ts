import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { forkJoinSafeEmpty, NavigationParams, NavigationParamsType } from '@hypertrace/common';
import { Filter, FilterBuilderLookupService } from '@hypertrace/components';
import { toFilterAttributeType } from '../../shared/graphql/model/metadata/attribute-metadata';
import { ObservabilityTraceType } from '../../shared/graphql/model/schema/observability-traces';
import { SPAN_SCOPE } from '../../shared/graphql/model/schema/span';
import { MetadataService } from '../../shared/services/metadata/metadata.service';
import { SavedQuery, ScopeQueryParam } from './explorer.component';

@Injectable({ providedIn: 'root' })
export class ExplorerService {
  public constructor(
    private readonly metadataService: MetadataService,
    private readonly filterBuilderLookupService: FilterBuilderLookupService
  ) {}
  public buildNavParamsWithFilters(
    scopeQueryParam: ScopeQueryParam,
    filters: DrilldownFilter[]
  ): Observable<NavigationParams> {
    const filterStrings$: Observable<string>[] = filters.map(filter =>
      this.metadataService
        .getAttribute(
          scopeQueryParam === ScopeQueryParam.EndpointTraces ? ObservabilityTraceType.Api : SPAN_SCOPE,
          filter.field
        )
        .pipe(
          map(attribute => ({ ...attribute, type: toFilterAttributeType(attribute.type) })),
          map(
            filterAttribute =>
              this.filterBuilderLookupService
                .lookup(filterAttribute.type)
                .buildFilter(filterAttribute, filter.operator, filter.value, filter.subpath).urlString
          )
        )
    );

    return forkJoinSafeEmpty(filterStrings$).pipe(
      map(filterStrings => ({
        navType: NavigationParamsType.InApp,
        path: '/explorer',
        queryParams: {
          filter: filterStrings,
          scope: scopeQueryParam
        }
      }))
    );
  }

  public isDuplicateQuery(currentQuery: SavedQuery, savedQueries: SavedQuery[]): boolean {
    for (const savedQuery of savedQueries) {
      if (isEqual(currentQuery, savedQuery)) {
        return true;
      }
    }

    return false;
  }
}

export type DrilldownFilter = Omit<Filter, 'metadata' | 'userString' | 'urlString'>;
