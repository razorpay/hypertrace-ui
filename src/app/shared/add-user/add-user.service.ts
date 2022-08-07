import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfoService } from '@hypertrace/common';
import { Observable } from 'rxjs';

const BASE_URL = 'https://hus.concierge.stage.razorpay.in/v1';

@Injectable()
export class AddUserService {
  private static userEmail: string;

  public constructor(private readonly http: HttpClient, private readonly userInfoService: UserInfoService) {
    AddUserService.userEmail = this.userInfoService.getUserData().email!;
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
