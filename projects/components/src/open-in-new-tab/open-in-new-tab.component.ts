import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconType } from '@hypertrace/assets-library';
import { ExternalNavigationParams } from '@hypertrace/common';
import { IconSize } from '../icon/icon-size';

@Component({
  selector: 'ht-open-in-new-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./open-in-new-tab.component.scss'],
  template: `
    <div *ngIf="this.paramsOrUrl" class="open-in-new-tab" [htTooltip]="this.getTextToDisplay()">
      <ht-link [paramsOrUrl]="this.getParamsOrUrl()" *ngIf="this.determineDisplayLogic(); else showOnlyText">
        <span class="text" *ngIf="this.showLinkText">{{ this.getTextToDisplay() }}</span>
        <ht-icon icon="${IconType.OpenInNewTab}" [size]="this.iconSize"></ht-icon>
      </ht-link>
      <ng-template #showOnlyText>
        <span class="text">
          {{ this.replacementTextIfRegexMatches ?? this.getTextToDisplay() }}
        </span>
      </ng-template>
    </div>
  `
})
export class OpenInNewTabComponent {
  @Input()
  public paramsOrUrl?: ExternalNavigationParams | string;

  @Input()
  public iconSize: IconSize = IconSize.Medium;

  @Input()
  public showLinkText: boolean = false;

  @Input()
  public linkPrefix: string = '';

  @Input()
  public regexToMatchForHiddenLink?: RegExp;

  @Input()
  public replacementTextIfRegexMatches?: string;

  public isNavigationParamsInstance(
    params: ExternalNavigationParams | string | undefined
  ): params is ExternalNavigationParams {
    return typeof params !== 'string';
  }

  public getParamsOrUrl(): string | ExternalNavigationParams {
    if (this.isNavigationParamsInstance(this.paramsOrUrl)) {
      return {
        ...this.paramsOrUrl,
        url: `${this.linkPrefix}${this.paramsOrUrl?.url}`
      };
    }

    return `${this.linkPrefix}${this.paramsOrUrl}`;
  }

  public getTextToDisplay(): string {
    if (this.isNavigationParamsInstance(this.paramsOrUrl)) {
      return this.paramsOrUrl.url;
    }

    return this.paramsOrUrl ?? '';
  }

  public determineDisplayLogic(): boolean {
    if (this.regexToMatchForHiddenLink !== undefined && this.regexToMatchForHiddenLink.test(this.getTextToDisplay())) {
      // Don't show the link, only show plain text
      return false;
    }

    // Show both link and text
    return true;
  }
}
