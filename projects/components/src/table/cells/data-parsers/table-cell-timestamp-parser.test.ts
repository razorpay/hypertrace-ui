import { Injector } from '@angular/core';
import { TableCellTimestampParser } from './table-cell-timestamp-parser';

describe('table cell timestamp parser', () => {
  const dateString = '2021-08-19T23:35:45.861Z';
  const date = new Date(dateString);
  const dateMillis = date.getTime();

  test('can parse date strings', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    expect(new TableCellTimestampParser({} as Injector).parseValue(dateString)).toEqual(date);
  });

  test('can parse numbers', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    expect(new TableCellTimestampParser({} as Injector).parseValue(dateMillis)).toEqual(dateMillis);
  });

  test('can parse date objects', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    expect(new TableCellTimestampParser({} as Injector).parseValue(date)).toEqual(date);
  });
});
