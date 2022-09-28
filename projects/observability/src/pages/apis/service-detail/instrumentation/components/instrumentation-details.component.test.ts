import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { HeuristicScoreInfo } from '../service-instrumentation.types';
import { InstrumentationDetailsComponent } from './instrumentation-details.component';

describe('InstrumentationDetailsComponent', () => {
  let component: InstrumentationDetailsComponent;
  let fixture: ComponentFixture<InstrumentationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstrumentationDetailsComponent],
      imports: [RouterTestingModule],
      providers: [
        mockProvider(ServiceInstrumentationService, {
          getColorForScore: () => ({ dark: '#ffa01c' })
        })
      ]
    });
    fixture = TestBed.createComponent(InstrumentationDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });

  test('assigns correct color to icon', () => {
    expect(component.getIconColor(50)).toBe('#ffa01c');
  });

  test('shows correct header summary', () => {
    expect(
      component.getHeaderSummary({ sampleSize: '10', failureCount: '9', sampleType: 'span' } as HeuristicScoreInfo)
    ).toBe('90% of spans failed this check');
  });
});
