import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProvider } from '@ngneat/spectator/jest';
import { BehaviorSubject, of } from 'rxjs';

import { GRAPHQL_OPTIONS } from '@hypertrace/graphql-client';
import { SavedQueriesModule } from '@hypertrace/observability';
import { ScopeQueryParam } from '../explorer/explorer.component';
import { SavedQueriesComponent } from './saved-queries.component';
import { SavedQueryResponse } from './saved-queries.service';

describe('SavedQueriesComponent', () => {
  let component: SavedQueriesComponent;
  let fixture: ComponentFixture<SavedQueriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedQueriesComponent],
      imports: [RouterTestingModule, SavedQueriesModule],
      providers: [
        {
          provide: GRAPHQL_OPTIONS,
          useValue: {
            uri: '/graphql',
            batchSize: 2
          }
        },
        mockProvider(HttpClient, {
          get: () => of({ payload: [] }),
          put: () => of({}),
          delete: () => of({ success: true })
        }),
        mockProvider(HttpHandler)
      ]
    });
    fixture = TestBed.createComponent(SavedQueriesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  test('should be created successfully', () => {
    expect(component).toBeDefined();
  });

  test('should contain not found text when no saved queries are available', () => {
    const debugElement = fixture.debugElement;
    const p = debugElement.query(By.css('.not-found-text')).nativeElement;
    expect(p.textContent).toContain("You haven't saved any queries! Go to Explorer page to save a query.");
  });

  test('renames a query successfully', () => {
    component.savedQueriesSubject = new BehaviorSubject<SavedQueryResponse[]>([
      {
        CreatedAt: 3,
        UpdatedAt: 4,
        DeletedAt: 0,
        OwnerID: 2,
        Id: 1,
        Data: { name: 'Query 1', scopeQueryParam: ScopeQueryParam.Spans, filters: [] }
      }
    ]);
    window.prompt = jest.fn().mockReturnValue('Query 2');

    component.onRename(1);
    expect(component.savedQueriesSubject.getValue()[0].Data.name).toBe('Query 2');
  });

  test('deletes a query successfully', () => {
    component.savedQueriesSubject = new BehaviorSubject<SavedQueryResponse[]>([
      {
        CreatedAt: 3,
        UpdatedAt: 4,
        DeletedAt: 0,
        OwnerID: 2,
        Id: 1,
        Data: { name: 'Query 1', scopeQueryParam: ScopeQueryParam.Spans, filters: [] }
      }
    ]);
    window.confirm = jest.fn().mockReturnValue(true);

    component.onDelete(1);
    expect(component.savedQueriesSubject.getValue().length).toBe(0);
  });
});
