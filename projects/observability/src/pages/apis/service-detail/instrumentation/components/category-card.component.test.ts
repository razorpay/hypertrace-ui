import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProvider } from '@ngneat/spectator/jest';

import { ServiceInstrumentationService } from '../service-instrumentation.service';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryCardComponent],
      imports: [RouterTestingModule],
      providers: [
        mockProvider(ServiceInstrumentationService, {
          getColorForScore: () => ({ dark: '' })
        })
      ]
    });
    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });

  test('should assign correct label to card action button based on catgory score', () => {
    expect(component.getButtonLabel(89)).toBe('Learn how to improve');
    expect(component.getButtonLabel(90)).toBe('See details');
  });

  test('shows correct number of checks passing', () => {
    expect(component.getNoOfChecksPassing()).toBe(0);
  });

  test('shows correct heuristicClass score for org', () => {
    component.heuristicClassScore = { name: 'a', score: 5 };
    component.orgCategoryScores = [{ name: 'a', score: 6 }];
    expect(component.getOrgScoreForCategory()).toBe(6);
  });
});
