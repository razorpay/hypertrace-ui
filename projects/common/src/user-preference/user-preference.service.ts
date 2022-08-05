import { UserInfoService } from './../user/user-info.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
interface TokenOptions {
  uri: string;
}
export const USER_PREFERENCES_OPTIONS = new InjectionToken<TokenOptions>('USER_PREFERENCE_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  public BASE_URL: string;
  public constructor(
    private readonly http: HttpClient,
    @Inject(USER_PREFERENCES_OPTIONS) tokenOptions: TokenOptions,
    private readonly userInfoService: UserInfoService
  ) {
    this.BASE_URL = tokenOptions.uri;
  }
  private addUserEmailHeader(): HttpHeaders {
    const requestHeaders = new HttpHeaders();
    const { email } = this.userInfoService.getUserData();

    return requestHeaders.append('user-email', email!);
  }
  public get<T>(endPoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.BASE_URL + endPoint, {
      params: params,
      headers: this.addUserEmailHeader()
    });
  }

  public post<T>(endPoint: string, body: object): Observable<T> {
    return this.http.post<T>(this.BASE_URL + endPoint, body, {
      headers: this.addUserEmailHeader()
    });
  }

  public put<T>(endPoint: string, body: object): Observable<T> {
    return this.http.put<T>(this.BASE_URL + endPoint, body, {
      headers: this.addUserEmailHeader()
    });
  }

  public delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.BASE_URL + endPoint, {
      headers: this.addUserEmailHeader()
    });
  }
}
