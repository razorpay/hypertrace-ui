import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { InstrumentationDetailsComponent } from './instrumentation-details.component';

describe('InstrumentationDetailsComponent', () => {
  let component: InstrumentationDetailsComponent;
  let fixture: ComponentFixture<InstrumentationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstrumentationDetailsComponent],
      imports: [RouterTestingModule],
      providers: [ServiceInstrumentationService]
    });
    fixture = TestBed.createComponent(InstrumentationDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });

  test('assigns correct color to icon', () => {
    expect(component.getIconColor(30)).toBe('#dc3d43');
    expect(component.getIconColor(50)).toBe('#ffa01c');
    expect(component.getIconColor(70)).toBe('#3d9a50');
  });

  test('assigns correct type to icon', () => {
    expect(component.getHeaderIcon(30)).toBe('svg:close');
    expect(component.getHeaderIcon(50)).toBe('svg:warning');
    expect(component.getHeaderIcon(70)).toBe('checkmark');
  });

  test('shows correct header summary', () => {
    expect(
      component.getHeaderSummary({
        sampleSize: '10',
        failureCount: '9',
        sampleType: 'span',
        name: '',
        description: '',
        evalTimestamp: '',
        sampleIds: [],
        score: 0
      })
    ).toBe('90% of spans failed this check');
  });
});
