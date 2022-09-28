import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelContentComponent } from './panel-content.component';

describe('PanelContentComponent', () => {
  let component: PanelContentComponent;
  let fixture: ComponentFixture<PanelContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelContentComponent]
    });
    fixture = TestBed.createComponent(PanelContentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });
});
