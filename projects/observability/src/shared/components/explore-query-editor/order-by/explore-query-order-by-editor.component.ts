import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@hypertrace/components';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GraphQlSortDirection } from '../../../graphql/model/schema/sort/graphql-sort-direction';

@Component({
  selector: 'ht-explore-query-order-by-editor',
  styleUrls: ['./explore-query-order-by-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-by-container">
      <div class="order-by-input-container">
        <span class="order-by-label"> Order </span>
        <div class="order-by-path-wrapper">
          <ht-select
            [showBorder]="true"
            class="order-by-selector"
            [selected]="this.currentOrderOption"
            (selectedChange)="this.onOrderByDirectionChange($event)"
          >
            <ht-select-option
              *ngFor="let option of this.orderOptions"
              [value]="option.value"
              [label]="option.label"
            ></ht-select-option>
          </ht-select>
        </div>
      </div>
    </div>
  `
})
export class ExploreQueryOrderByEditorComponent {
  @Output()
  public readonly orderByDirectionChange: EventEmitter<GraphQlSortDirection | undefined> = new EventEmitter();

  public readonly orderOptions: SelectOption<string | undefined>[] = this.getOrderByOptions();
  private readonly orderByExpressionsToEmit: Subject<GraphQlSortDirection | undefined> = new Subject();

  public readonly currentOrderOption: string | undefined = this.orderOptions[0].value;

  public constructor() {
    this.orderByExpressionsToEmit.pipe(debounceTime(500)).subscribe(this.orderByDirectionChange);
  }

  public onOrderByDirectionChange(newDirection?: GraphQlSortDirection): void {
    this.orderByExpressionsToEmit.next(newDirection);
  }

  private getOrderByOptions(): SelectOption<string | undefined>[] {
    return [
      this.getEmptyOrderByOption(),
      ...['Asc', 'Desc'].map(order => ({
        label: order,
        value: order.toUpperCase()
      }))
    ];
  }

  private getEmptyOrderByOption(): SelectOption<string | undefined> {
    return {
      value: undefined,
      label: 'None'
    };
  }
}
