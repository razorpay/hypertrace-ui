import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SubscriptionLifecycle, UserTraits } from '@hypertrace/common';
import { SavedQuery } from '../explorer/explorer.component';

const BASE_URL = 'https://hus.concierge.stage.razorpay.in/v1';

@Injectable()
export class SavedQueriesService {
  private static userEmail: string;

  public constructor(private readonly http: HttpClient, private readonly subscriptionLifecycle: SubscriptionLifecycle) {
    // tslint:disable-next-line: ban-ts-ignore
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      SavedQueriesService.userEmail = 'shivam.rai@razorpay.com';
    } else {
      this.subscriptionLifecycle.add(
        this.http
          .get<UserTraits>('https://hypertrace.concierge.stage.razorpay.in/user-info')
          .subscribe(data => (SavedQueriesService.userEmail = data.email ?? ''))
      );
    }
  }

  public saveQuery(query: SavedQuery): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${BASE_URL}/query/save`, query, {
      headers: {
        'user-email': SavedQueriesService.userEmail
      }
    });
  }

  public getAllQueries(): Observable<SavedQueryResponse[]> {
    return this.http
      .get<{ payload: SavedQueryResponse[] }>(`${BASE_URL}/query/all?sort=created_at&order=DESC`, {
        headers: {
          'user-email': SavedQueriesService.userEmail
        }
      })
      .pipe(map(response => response.payload));
  }

  public updateQueryById(queryId: number, queryData: SavedQuery): Observable<SavedQueryResponse> {
    return this.http
      .put<{ payload: SavedQueryResponse }>(`${BASE_URL}/query/${queryId}`, queryData, {
        headers: {
          'user-email': SavedQueriesService.userEmail
        }
      })
      .pipe(map(response => response.payload));
  }

  public deleteQueryById(queryId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${BASE_URL}/query/${queryId}`, {
      headers: {
        'user-email': SavedQueriesService.userEmail
      }
    });
  }
}

export interface SavedQueryResponse {
  CreatedAt: number;
  Data: SavedQuery;
  DeletedAt: number;
  Id: number;
  OwnerID: number;
  UpdatedAt: number;
}
