import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { createHostFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';

import { RouterTestingModule } from '@angular/router/testing';
import { IconLibraryTestingModule, IconType } from '@hypertrace/assets-library';
import { CartesianExplorerContextMenuComponent, ContextMenu } from './cartesian-explorer-context-menu.component';
import { PopoverService } from '@hypertrace/components';

describe('Cartesian Explorer Context menu component', () => {
  let spectator: Spectator<CartesianExplorerContextMenuComponent>;

  const createHost = createHostFactory({
    declareComponent: false,
    component: CartesianExplorerContextMenuComponent
  });

  test('correctly renders context menu', fakeAsync(() => {
    spectator = createHost(
      `<ht-cartesian-explorer-context-menu
        [menus]="menus"
      ></ht-cartesian-explorer-context-menu>`,
      {
        hostProps: {
          menus: [
            {
              name: 'Explore',
              icon: IconType.ArrowUpRight
            }
          ]
        }
      }
    );

    expect(spectator.query('.context-menu')).toExist();
  }));
});
