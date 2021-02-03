import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { LayoutChangeService, SubscriptionLifecycle, TypedSimpleChanges } from '@hypertrace/common';
import { Observable, throwError } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SplitterDirection } from './splitter';
import { SplitterService } from './splitter.service';

@Component({
  selector: 'ht-splitter',
  styleUrls: ['./splitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SplitterService, SubscriptionLifecycle],
  template: `
    <div
      class="splitter"
      *ngIf="this.direction"
      [ngClass]="[this.direction | lowercase]"
      [ngStyle]="this.splitterSizeStyle"
    >
      <div class="line"></div>
      <div class="cursor"></div>
      <div class="line"></div>
    </div>
  `
})
export class SplitterComponent implements OnChanges {
  @Input()
  public readonly direction?: SplitterDirection;

  @Input()
  public readonly debounceTime: number = 20;

  @Input()
  public readonly splitterSize: number = 3;

  @Output()
  public readonly layoutChange: EventEmitter<boolean> = new EventEmitter();

  public splitterSizeStyle?: Partial<CSSStyleDeclaration>;

  public constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly splitterService: SplitterService,
    private readonly subscriptionLifecycle: SubscriptionLifecycle,
    private readonly layoutChangeService: LayoutChangeService
  ) {}

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    if (changes.splitterSize || changes.direction) {
      this.setSplitterSizeStyle();
    }
    this.setupMouseActionSubscription();
  }

  private setupMouseActionSubscription(): void {
    this.subscriptionLifecycle.unsubscribe();

    this.subscriptionLifecycle.add(
      this.buildSplitterLayoutChangeObservable()
        .pipe(debounceTime(this.debounceTime))
        .subscribe(layoutChange => {
          this.layoutChange.emit(layoutChange);
          layoutChange && this.layoutChangeService.publishLayoutChange();
        })
    );
  }

  private buildSplitterLayoutChangeObservable(): Observable<boolean> {
    const hostElement = this.element.nativeElement;
    const parentOfHostElement = hostElement.parentElement;

    if (!parentOfHostElement) {
      return throwError('Parent container element not present');
    }

    if (this.direction === undefined) {
      return throwError('Direction must be defined');
    }

    return this.splitterService.buildSplitterLayoutChangeObservable(
      hostElement,
      parentOfHostElement,
      this.direction,
      this.splitterSize
    );
  }

  private setSplitterSizeStyle(): void {
    if (this.direction === SplitterDirection.Horizontal) {
      this.splitterSizeStyle = {
        height: `${this.splitterSize}px`
      };
    }

    if (this.direction === SplitterDirection.Vertical) {
      this.splitterSizeStyle = {
        width: `${this.splitterSize}px`
      };
    }
  }
}
