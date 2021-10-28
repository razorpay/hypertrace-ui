import { fakeAsync } from '@angular/core/testing';
import { createHostFactory, Spectator } from '@ngneat/spectator/jest';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IconLibraryTestingModule, IconType } from '@hypertrace/assets-library';
import { PopoverService } from '@hypertrace/components';
import { mockProvider } from '@ngneat/spectator';
import { CartesianExplorerContextMenuComponent } from './cartesian-explorer-context-menu.component';
import { CartesianExplorerContextMenuModule } from './cartesian-explorer-context-menu.module';

describe('Cartesian Explorer Context menu component', () => {
  let spectator: Spectator<CartesianExplorerContextMenuComponent>;

  const mockPopoverRef = {
    close: jest.fn()
  };

  const createHost = createHostFactory({
    declareComponent: false,
    component: CartesianExplorerContextMenuComponent,
    providers: [
      mockProvider(PopoverService, {
        drawPopover: jest.fn().mockReturnValue(mockPopoverRef)
      })
    ],
    imports: [CartesianExplorerContextMenuModule, HttpClientTestingModule, IconLibraryTestingModule]
  });

  test('correctly renders context menu', fakeAsync(() => {
    const menuSelectSpy = jest.fn();

    spectator = createHost(
      `<ht-cartesian-explorer-context-menu
        [menus]="menus"
        (menuSelect)="contextMenuSelectHandler($event)"
      ></ht-cartesian-explorer-context-menu>`,
      {
        hostProps: {
          menus: [
            {
              name: 'Explore',
              icon: IconType.ArrowUpRight
            }
          ],
          contextMenuSelectHandler: menuSelectSpy
        }
      }
    );

    expect(spectator.query('.context-menu')).toExist();

    spectator.tick();

    const buttonElement = spectator.query('button')!;

    // Click will toggle the values to true
    spectator.click(buttonElement);
    expect(menuSelectSpy).toHaveBeenCalledWith({
      name: 'Explore',
      icon: IconType.ArrowUpRight
    });
  }));
});
