import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { IconType } from '@hypertrace/assets-library';
import { TypedSimpleChanges } from '@hypertrace/common';
import { InFilterModalComponent, InFilterModalData } from '../../filtering/filter-modal/in-filter-modal.component';
import { FilterAttribute } from '../../filtering/filter/filter-attribute';
import { FilterOperator } from '../../filtering/filter/filter-operators';
import { FilterParserLookupService } from '../../filtering/filter/parser/filter-parser-lookup.service';
import { IconSize } from '../../icon/icon-size';
import { ModalSize } from '../../modal/modal';
import { ModalService } from '../../modal/modal.service';
import { TableCellAlignmentType } from '../cells/types/table-cell-alignment-type';
import { TableEditColumnsModalComponent } from '../columns/table-edit-columns-modal.component';
import { TableCdkColumnUtil } from '../data/table-cdk-column-util';
import { TableSortDirection } from '../table-api';
import { TableColumnConfigExtended } from '../table.service';

@Component({
  selector: 'ht-table-header-cell-renderer',
  styleUrls: ['./table-header-cell-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="this.columnConfig"
      [htTooltip]="this.getTooltip(this.columnConfig.titleTooltip, this.columnConfig.title)"
      class="table-header-cell-renderer"
    >
      <ng-container *ngIf="!this.isStateColumn; else stateColumnTemplate">
        <ng-container *ngIf="this.isShowOptionButton && this.leftAlignFilterButton">
          <ng-container *ngTemplateOutlet="optionsButton"></ng-container>
        </ng-container>
        <div class="title" [ngClass]="this.classes" (click)="this.onSortChange()">
          <span>{{ this.columnConfig.title }}</span>
          <ng-container *ngIf="this.sort">
            <ht-icon
              class="sort-icon"
              [icon]="
                this.sort === '${TableSortDirection.Descending}' ? '${IconType.ArrowDown}' : '${IconType.ArrowUp}'
              "
              size="${IconSize.ExtraSmall}"
            ></ht-icon>
          </ng-container>
        </div>

        <ng-container *ngIf="this.isShowOptionButton && !this.leftAlignFilterButton">
          <ng-container *ngTemplateOutlet="optionsButton"></ng-container>
        </ng-container>
      </ng-container>

      <ng-template #stateColumnTemplate>
        <ng-container *ngIf="this.isMultipleSelectionStateColumn">
          <ht-checkbox
            class="state-checkbox"
            [htTooltip]="this.getHeaderCheckboxTooltip()"
            [indeterminate]="this.indeterminateRowsSelected"
            (checkedChange)="this.onToggleAllSelectedChange($event)"
          ></ht-checkbox>
        </ng-container>
      </ng-template>

      <ng-template #htmlTooltip>
        <div [innerHTML]="this.columnConfig?.titleTooltip"></div>
      </ng-template>

      <ng-template #optionsButton>
        <ht-popover class="options-button" [closeOnClick]="true">
          <ht-popover-trigger>
            <div #trigger>
              <ht-icon icon="${IconType.MoreHorizontal}" size="${IconSize.Small}"></ht-icon>
            </div>
          </ht-popover-trigger>
          <ht-popover-content>
            <div [style.min-width.px]="trigger.offsetWidth" class="popover-content">
              <ng-container *ngIf="this.isFilterable">
                <div class="popover-item" (click)="this.onFilterValues()" *ngIf="this.isFilterable">Filter Values</div>
              </ng-container>
              <ng-container *ngIf="this.columnConfig.sortable !== false">
                <div class="popover-item-divider"></div>
                <div class="popover-item sort-ascending" (click)="this.onSortChange(SORT_ASC)">
                  Sort Ascending
                  <ht-icon class="popover-item-icon" icon="${IconType.ArrowUp}" size="${IconSize.Small}"></ht-icon>
                </div>
                <div class="popover-item sort-descending" (click)="this.onSortChange(SORT_DESC)">
                  Sort Descending
                  <ht-icon class="popover-item-icon" icon="${IconType.ArrowDown}" size="${IconSize.Small}"></ht-icon>
                </div>
              </ng-container>

              <ng-container *ngIf="this.editable && this.isEditableAvailableColumns">
                <div class="popover-item-divider"></div>
                <div class="popover-item" (click)="this.onEditColumns()">Edit Columns</div>
              </ng-container>
            </div>
          </ht-popover-content>
        </ht-popover>
      </ng-template>
    </div>
  `
})
export class TableHeaderCellRendererComponent implements OnInit, OnChanges {
  public readonly SORT_ASC: TableSortDirection = TableSortDirection.Ascending;
  public readonly SORT_DESC: TableSortDirection = TableSortDirection.Descending;

  @Input()
  public editable?: boolean = false;

  @Input()
  public metadata?: FilterAttribute[];

  @Input()
  public availableColumns?: TableColumnConfigExtended[] = [];

  @Input()
  public columnConfig?: TableColumnConfigExtended;

  @Input()
  public index?: number;

  @Input()
  public sort?: TableSortDirection;

  @Input()
  public indeterminateRowsSelected?: boolean;

  @Output()
  public readonly sortChange: EventEmitter<TableSortDirection | undefined> = new EventEmitter();

  @Output()
  public readonly columnsChange: EventEmitter<TableColumnConfigExtended[]> = new EventEmitter();

  @Output()
  public readonly allRowsSelectionChange: EventEmitter<boolean> = new EventEmitter();

  public alignment?: TableCellAlignmentType;
  public leftAlignFilterButton: boolean = false;
  public classes: string[] = [];

  public isFilterable: boolean = false;
  public isEditableAvailableColumns: boolean = false;
  public isShowOptionButton: boolean = false;
  public isStateColumn: boolean = false;
  public isMultipleSelectionStateColumn: boolean = false;
  private allRowsSelected: boolean = false;

  @ViewChild('htmlTooltip')
  public htmlTooltipTemplate?: TemplateRef<unknown>;
  public sanitizedHtmlForTooltip?: string;

  public constructor(
    private readonly modalService: ModalService,
    private readonly filterParserLookupService: FilterParserLookupService
  ) {}

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    if (changes.columnConfig || changes.sort) {
      this.classes = this.buildClasses();
    }

    if (changes.columnConfig || changes.metadata) {
      this.isFilterable = this.isAttributeFilterable();
      this.isEditableAvailableColumns = this.areAnyAvailableColumnsEditable();
      this.isShowOptionButton =
        this.isFilterable || this.isEditableAvailableColumns || this.columnConfig?.sortable === true;
      this.isStateColumn = this.columnConfig?.id === '$$selected' || this.columnConfig?.id === '$$expanded';
      this.isMultipleSelectionStateColumn = this.columnConfig?.id === '$$selected';
    }
  }

  public ngOnInit(): void {
    if (this.columnConfig === undefined) {
      throw new Error('Table column config undefined');
    }

    if (this.index === undefined) {
      throw new Error('Table column index undefined');
    }

    // Allow columnConfig to override default alignment for cell renderer
    this.alignment = this.columnConfig.alignment ?? this.columnConfig.renderer.alignment;
    this.leftAlignFilterButton = this.alignment === TableCellAlignmentType.Right;
    this.classes = this.buildClasses();
  }

  public onToggleAllSelectedChange(allSelected: boolean): void {
    this.allRowsSelected = allSelected;
    this.allRowsSelectionChange.emit(allSelected);
  }

  public getHeaderCheckboxTooltip(): string {
    return this.indeterminateRowsSelected
      ? 'Some rows are selected'
      : this.allRowsSelected
      ? 'All rows in the table are selected'
      : 'None of the rows in the table are selected';
  }

  private buildClasses(): string[] {
    return [
      ...(this.alignment !== undefined ? [this.alignment.toLowerCase()] : []),
      ...(this.sort !== undefined ? [this.sort.toLowerCase()] : []),
      ...(this.columnConfig && TableCdkColumnUtil.isColumnSortable(this.columnConfig) ? ['sortable'] : [])
    ];
  }

  public onSortChange(direction?: TableSortDirection): void {
    this.sortChange.emit(direction ?? this.getNextSortDirection(this.sort));
  }

  public getTooltip(
    titleTooltip: string | undefined,
    title: string | undefined
  ): string | TemplateRef<unknown> | undefined {
    if (titleTooltip === undefined) {
      return title;
    }

    return this.htmlTooltipTemplate;
  }

  private isAttributeFilterable(): boolean {
    return (
      this.metadata !== undefined &&
      this.columnConfig !== undefined &&
      this.columnConfig.filterable === true &&
      this.columnConfig.attribute !== undefined &&
      this.filterParserLookupService.isParsableOperatorForType(FilterOperator.In, this.columnConfig.attribute.type)
    );
  }

  private areAnyAvailableColumnsEditable(): boolean {
    if (this.availableColumns === undefined) {
      return false;
    }

    return this.availableColumns.some(column => this.isColumnEditable(column));
  }

  private isColumnEditable(columnConfig: TableColumnConfigExtended): boolean {
    return columnConfig.editable === true;
  }

  public onFilterValues(): void {
    this.isFilterable &&
      this.modalService.createModal<InFilterModalData>({
        content: InFilterModalComponent,
        size: ModalSize.Medium,
        showControls: true,
        title: 'Filter Column',
        data: {
          metadata: this.metadata || [],
          attribute: this.columnConfig?.attribute!,
          values: this.columnConfig?.filterValues ?? []
        }
      });
  }

  public onEditColumns(): void {
    this.modalService
      .createModal<TableColumnConfigExtended[], TableColumnConfigExtended[]>({
        content: TableEditColumnsModalComponent,
        size: ModalSize.Medium,
        showControls: true,
        title: 'Edit Columns',
        data: this.availableColumns ?? []
      })
      .closed$.subscribe(columnConfigs => {
        this.columnsChange.emit(columnConfigs);
      });
  }

  private getNextSortDirection(sortDirection?: TableSortDirection): TableSortDirection | undefined {
    // Order: undefined -> Ascending -> Descending -> undefined
    switch (sortDirection) {
      case TableSortDirection.Ascending:
        return TableSortDirection.Descending;
      case TableSortDirection.Descending:
        return undefined;
      default:
        return TableSortDirection.Ascending;
    }
  }
}
