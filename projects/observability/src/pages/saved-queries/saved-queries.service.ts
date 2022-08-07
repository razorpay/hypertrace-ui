import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PreferenceService, SubscriptionLifecycle, UserInfoService } from '@hypertrace/common';
import { Filter } from '@hypertrace/components';
import { ScopeQueryParam } from '../explorer/explorer.types';

@Injectable()
export class SavedQueriesService {
  private static userEmail: string;
  // Replace this with UserPreferenceService when its available
  private readonly baseUrl: string = '/user-preferences';

  public constructor(
    private readonly http: HttpClient,
    private readonly subscriptionLifecycle: SubscriptionLifecycle,
    private readonly preferenceService: PreferenceService,
    private readonly userInfoService: UserInfoService
  ) {
    SavedQueriesService.userEmail = this.userInfoService.getUserData().email!;

    // tslint:disable-next-line: ban-ts-ignore
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      this.baseUrl = 'https://hus.concierge.stage.razorpay.in';
    }
  }

  public saveQuery(query: SavedQuery): Observable<SavedQueryResponse> {
    return this.http.post<SavedQueryResponse>(`${this.baseUrl}/v1/query/save`, query, {
      headers: {
        'user-email': SavedQueriesService.userEmail
      }
    });
  }

  public getAllQueries(): Observable<SavedQueryPayload[]> {
    return this.http
      .get<{ payload: SavedQueryPayload[] }>(`${this.baseUrl}/v1/query/all?sort=created_at&order=DESC`, {
        headers: {
          'user-email': SavedQueriesService.userEmail
        }
      })
      .pipe(map(response => response.payload));
  }

  public updateQueryById(queryId: number, queryData: SavedQuery): Observable<SavedQueryPayload> {
    return this.http
      .put<{ payload: SavedQueryPayload }>(`${this.baseUrl}/v1/query/${queryId}`, queryData, {
        headers: {
          'user-email': SavedQueriesService.userEmail
        }
      })
      .pipe(map(response => response.payload));
  }

  public deleteQueryById(queryId: number): Observable<SavedQueryResponse> {
    return this.http.delete<SavedQueryResponse>(`${this.baseUrl}/v1/query/${queryId}`, {
      headers: {
        'user-email': SavedQueriesService.userEmail
      }
    });
  }

  /**
   * Temporary method to support transition from localStorage to backend service.
   * This removes old saved queries from localStorage and moves them to backend
   * storage. This method can be safely deleted around December 2022, assuming
   * 6 months is enough time for a user to visit the Hypertrace Explorer or Saved
   * Queries pages, which triggers this method. Reading from localStorage has a
   * performance impact so this method shouldn't be left in the code when it's
   * no longer needed.
   */
  public moveOldQueries(): void {
    this.subscriptionLifecycle.add(
      this.preferenceService.get('savedQueries', []).subscribe((queries: SavedQuery[]) => {
        if (queries.length > 0) {
          queries.forEach(query => this.subscriptionLifecycle.add(this.saveQuery(query).subscribe()));
          this.preferenceService.set('savedQueries', []);
        }
      })
    );
  }
}

export interface SavedQueryPayload {
  CreatedAt: number;
  Data: SavedQuery;
  DeletedAt: number;
  Id: number;
  OwnerID: number;
  UpdatedAt: number;
}

export interface SavedQuery {
  name: string;
  scopeQueryParam: ScopeQueryParam;
  filters: Filter[];
}

interface SavedQueryResponse {
  success: boolean;
}
