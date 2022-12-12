import { Observable } from 'rxjs';
import { TableColumnConfig, TableFilter, TableSortDirection } from '../table-api';

export interface TableDataSource<TResult, TCol extends TableColumnConfig = TableColumnConfig> {
  getData(request: TableDataRequest<TCol>): Observable<TableDataResponse<TResult>>;
  getScope?(): string | undefined;
}

export interface TableDataRequest<TCol extends TableColumnConfig = TableColumnConfig> {
  columns: TCol[];
  position: {
    startIndex: number;
    limit: number;
  };
  sort?: SortSpecification<TCol>;
  filters?: TableFilter[];
  includeInactive?: boolean;
  clientSideFilters?: TableFilter[];
  clientSideSort?: SortSpecification<TCol>;
}

export interface TableDataResponse<TData> {
  data: TData[];
  totalCount: number;
}

export interface SortSpecification<T> {
  column: T;
  direction: TableSortDirection;
}

export interface ClientSideSort {
  direction: TableSortDirection;
  defaultSortColumnIndex: number;
}
