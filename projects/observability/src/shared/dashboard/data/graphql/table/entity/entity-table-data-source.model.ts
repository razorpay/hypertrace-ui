import {
  FilterOperator,
  TableDataRequest,
  TableDataResponse,
  TableFilter,
  TableRow,
  TableSortDirection
} from '@hypertrace/components';
import {
  ARRAY_PROPERTY,
  Model,
  ModelModelPropertyTypeInstance,
  ModelProperty,
  ModelPropertyType,
  STRING_PROPERTY
} from '@hypertrace/hyperdash';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isMetricAggregation, MetricAggregation } from '../../../../../graphql/model/metrics/metric-aggregation';
import { Entity, EntityType } from '../../../../../graphql/model/schema/entity';
import { GraphQlEntityFilter } from '../../../../../graphql/model/schema/filter/entity/graphql-entity-filter';
import { GraphQlFilter } from '../../../../../graphql/model/schema/filter/graphql-filter';
import { EntitySpecification } from '../../../../../graphql/model/schema/specifications/entity-specification';
import { Specification } from '../../../../../graphql/model/schema/specifier/specification';
import { EntitiesResponse } from '../../../../../graphql/request/handlers/entities/query/entities-graphql-query-builder.service';
import {
  ENTITIES_GQL_REQUEST,
  GraphQlEntitiesQueryRequest
} from '../../../../../graphql/request/handlers/entities/query/entities-graphql-query-handler.service';
import { SpecificationBackedTableColumnDef } from '../../../../widgets/table/table-widget-column.model';
import { TableDataSourceModel } from '../table-data-source.model';

@Model({
  type: 'entity-table-data-source'
})
export class EntityTableDataSourceModel extends TableDataSourceModel {
  @ModelProperty({
    key: 'entity',
    required: true,
    type: STRING_PROPERTY.type
  })
  public entityType!: EntityType;

  @ModelProperty({
    key: 'child-data-source',
    // tslint:disable-next-line: no-object-literal-type-assertion
    type: {
      key: ModelPropertyType.TYPE,
      defaultModelClass: EntityTableDataSourceModel
    } as ModelModelPropertyTypeInstance,
    required: false
  })
  public childEntityDataSource?: EntityTableDataSourceModel;

  @ModelProperty({
    key: 'additional-specifications',
    displayName: 'Additional Specifications',
    required: false,
    type: ARRAY_PROPERTY.type
  })
  public additionalSpecifications: Specification[] = [];

  public getScope(): string {
    return this.entityType;
  }

  protected buildGraphQlRequest(
    filters: GraphQlFilter[],
    request: TableDataRequest<SpecificationBackedTableColumnDef>
  ): GraphQlEntitiesQueryRequest {
    // tslint:disable-next-line: strict-boolean-expressions
    if (this.isClientSideRendered) {
      request.clientSideFilters = request.filters;
      if (request.sort !== undefined) {
        request.clientSideSort = {
          direction: request.sort.direction,
          column: request.sort.column
        };
      }
    }
    const offset = this.isClientSideRendered ? 0 : request.position.startIndex;

    let sort = request.sort && {
      direction: request.sort.direction,
      key: request.sort.column.specification
    };

    if (this.isClientSideRendered && this.clientSideSort !== undefined) {
      sort = {
        direction: this.clientSideSort.direction,
        key: request.columns[this.clientSideSort.defaultSortColumnIndex].specification
      };
    }

    return {
      requestType: ENTITIES_GQL_REQUEST,
      entityType: this.entityType,
      properties: request.columns.map(column => column.specification).concat(...this.additionalSpecifications),
      limit: this.limit ?? request.position.limit * 2, // Prefetch 2 pages,
      offset: offset,
      sort: sort,
      filters: this.isClientSideRendered ? [] : [...filters, ...this.toGraphQlFilters(request.filters)],
      timeRange: this.getTimeRangeOrThrow(),
      includeTotal: true,
      includeInactive: request.includeInactive
    };
  }

  protected buildTableResponse(
    response: EntitiesResponse,
    request: TableDataRequest<SpecificationBackedTableColumnDef>
  ): TableDataResponse<TableRow> {
    let results: Entity<string>[] = response.results;
    if (
      this.isClientSideRendered &&
      request.clientSideFilters?.length !== undefined &&
      request.clientSideFilters.length > 0
    ) {
      request.clientSideFilters.forEach(clientSideFilter => {
        const matchingColumn = this.findMatchingColumnConfigForClientSideFilter(
          clientSideFilter.field,
          request.columns
        );
        if (matchingColumn !== undefined) {
          results = this.filterRespValuesForClientSideFilter(matchingColumn, results, clientSideFilter);
        }
      });
    }

    if (request.clientSideSort !== undefined && this.isClientSideRendered && results.length > 0) {
      if (isMetricAggregation(results[0][request.clientSideSort.column.id])) {
        results.sort((res1, res2) => {
          if (request.clientSideSort!.direction === TableSortDirection.Ascending) {
            return (
              (res1[request.clientSideSort!.column.id] as MetricAggregation).value -
              (res2[request.clientSideSort!.column.id] as MetricAggregation).value
            );
          }

          return (
            (res2[request.clientSideSort!.column.id] as MetricAggregation).value -
            (res1[request.clientSideSort!.column.id] as MetricAggregation).value
          );
        });
      } else {
        results.sort((res1, res2) => {
          if (request.clientSideSort!.direction === TableSortDirection.Ascending) {
            return ((res1[request.clientSideSort!.column.id] as Entity).name as string).localeCompare(
              (res2[request.clientSideSort!.column.id] as Entity).name as string
            );
          }

          return ((res2[request.clientSideSort!.column.id] as Entity).name as string).localeCompare(
            (res1[request.clientSideSort!.column.id] as Entity).name as string
          );
        });
      }
    }

    return {
      data: this.resultsAsTreeRows(results, request, this.childEntityDataSource !== undefined),
      totalCount: this.isClientSideRendered ? results.length : response.total ?? 0
    };
  }

  private findMatchingColumnConfigForClientSideFilter(
    filterKeyName: string,
    columnDefs: SpecificationBackedTableColumnDef[]
  ): SpecificationBackedTableColumnDef | undefined {
    return columnDefs.find(
      maybeColumn =>
        (maybeColumn.specification as EntitySpecification).asGraphQlOrderByFragment().expression.key === filterKeyName
    );
  }

  private filterRespValuesForClientSideFilter(
    columnDef: SpecificationBackedTableColumnDef,
    rows: Entity[],
    tableFilter: TableFilter
  ): Entity<string>[] {
    const actualKeyNameInRows = columnDef.specification.resultAlias();

    switch (tableFilter.operator) {
      case FilterOperator.Equals:
        return rows.filter(eachRow => ((eachRow[actualKeyNameInRows] as Entity).name as string) === tableFilter.value);
      case FilterOperator.Like:
        const regexExp = new RegExp(tableFilter.value as string);
        return rows.filter(eachRow => regexExp.test((eachRow[actualKeyNameInRows] as Entity).name as string));
      case FilterOperator.In:
        return rows.filter(eachRow =>
          (tableFilter.value as string[]).includes((eachRow[actualKeyNameInRows] as Entity).name as string)
        );
      default:
        return rows;
    }
  }

  private resultsAsTreeRows(
    results: Entity[],
    request: TableDataRequest<SpecificationBackedTableColumnDef>,
    expandable: boolean
  ): TableRow[] {
    return results.map(entity => ({
      ...entity,
      getChildren: () => (expandable ? this.queryEntityChildren(entity, request) : EMPTY),
      isExpandable: () => expandable
    }));
  }

  private queryEntityChildren(
    entity: Entity,
    parentRequest: TableDataRequest<SpecificationBackedTableColumnDef>
  ): Observable<TableRow[]> {
    return this.childEntityDataSource!.getDataForParentEntity(entity, this.buildChildTableRequest(parentRequest));
  }

  private getDataForParentEntity(
    entity: Entity,
    request: TableDataRequest<SpecificationBackedTableColumnDef>
  ): Observable<TableRow[]> {
    return this.query(filters =>
      this.buildGraphQlRequest([...filters, GraphQlEntityFilter.forEntity(entity)], request)
    ).pipe(
      map(response => this.buildTableResponse(response as EntitiesResponse, request)),
      map(response => this.resultsAsTreeRows(response.data as Entity[], request, false))
    );
  }

  private buildChildTableRequest(
    parentRequest: TableDataRequest<SpecificationBackedTableColumnDef>
  ): TableDataRequest<SpecificationBackedTableColumnDef> {
    return {
      columns: parentRequest.columns,
      position: {
        startIndex: 0,
        limit: 20
      },
      sort: parentRequest.sort
    };
  }
}
