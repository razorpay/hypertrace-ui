import { APP_INITIALIZER, NgModule } from '@angular/core';
import { UserService } from './user.service';
@NgModule({
  providers: [
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: (us: UserService) => () => us.load(),
      deps: [UserService],
      multi: true
    }
  ]
})
export class UserModule {}
