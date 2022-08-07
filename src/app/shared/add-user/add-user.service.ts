import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoService } from '@hypertrace/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddUserService {
  private static userEmail: string;
  // Replace this with UserPreferenceService when its available
  private readonly baseUrl: string = '/user-preferences';

  public constructor(private readonly http: HttpClient, private readonly userInfoService: UserInfoService) {
    AddUserService.userEmail = this.userInfoService.getUserData().email!;

    // tslint:disable-next-line: ban-ts-ignore
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      this.baseUrl = 'https://hus.concierge.stage.razorpay.in';
    }
  }

  public addUser(): Observable<AddUserResponse> {
    return this.http.get<AddUserResponse>(`${this.baseUrl}/v1/user/add`, {
      headers: {
        'user-email': AddUserService.userEmail
      }
    });
  }
}

interface AddUserResponse {
  success: boolean;
}
