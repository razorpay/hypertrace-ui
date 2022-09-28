import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProvider } from '@ngneat/spectator';
import { BehaviorSubject } from 'rxjs';

import { ServiceInstrumentationComponent } from './service-instrumentation.component';
import { ServiceInstrumentationService } from './service-instrumentation.service';

describe('ServiceInstrumentationComponent', () => {
  let component: ServiceInstrumentationComponent;
  let fixture: ComponentFixture<ServiceInstrumentationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceInstrumentationComponent],
      imports: [RouterTestingModule],
      providers: [
        mockProvider(ServiceInstrumentationService, {
          serviceScoreSubject: new BehaviorSubject(undefined)
        })
      ]
    });
    fixture = TestBed.createComponent(ServiceInstrumentationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });

  test('uses subject from common service', () => {
    expect(component.getServiceScore().getValue()).toBe(undefined);
  });
});
