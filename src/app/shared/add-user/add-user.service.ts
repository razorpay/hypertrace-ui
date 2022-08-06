import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubscriptionLifecycle } from '@hypertrace/common';
import { Observable } from 'rxjs';

const BASE_URL = 'https://hus.concierge.stage.razorpay.in/v1';

@Injectable()
export class AddUserService {
  private static userEmail: string;

  public constructor(private readonly http: HttpClient, private readonly subscriptionLifecycle: SubscriptionLifecycle) {
    // tslint:disable-next-line: ban-ts-ignore
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      AddUserService.userEmail = 'ht-user@razorpay.com';
    } else {
      this.subscriptionLifecycle.add(
        this.http
          .get<{ email: string }>('https://hypertrace.concierge.stage.razorpay.in/user-info')
          .subscribe(data => (AddUserService.userEmail = data.email ?? ''))
      );
    }
  }

  public addUser(): Observable<AddUserResponse> {
    return this.http.get<AddUserResponse>(`${BASE_URL}/user/add`, {
      headers: {
        'user-email': AddUserService.userEmail
      }
    });
  }
}

interface AddUserResponse {
  success: boolean;
}
