import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserTraits } from '../telemetry/telemetry';
import { InMemoryStorage } from '../utilities/browser/storage/in-memory-storage';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public BASE_URL: string = '/user-preferences';
  public static readonly STORAGE_KEY: 'user-data';
  public static readonly DEFAULT_USER: UserTraits = { name: 'Default User', email: 'ht-user@razorpay.com' };
  public constructor(private readonly http: HttpClient, private readonly inMemoryStorage: InMemoryStorage) {}
  public load(): void {
    this.http.get<UserTraits>('/user-info').subscribe(
      (data: UserTraits) => {
        this.inMemoryStorage.set(UserInfoService.STORAGE_KEY, JSON.stringify(data));
      },
      error => {
        // tslint:disable-next-line: no-console
        console.error('something went wrong in while fetching user-info', error);
      }
    );
  }
  public getUserData(): UserTraits {
    const user = this.inMemoryStorage.get(UserInfoService.STORAGE_KEY);
    if (user !== undefined) {
      return JSON.parse(user);
    }

    return UserInfoService.DEFAULT_USER;
  }
}
