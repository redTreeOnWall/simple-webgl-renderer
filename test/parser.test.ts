import {ObjParser} from "../src/parser/ObjParser";

test( 'readTheeNumber', () => {
  const array: number[] = [];
  ObjParser.readTheeNumber(0, '1.2 3.3 4.2', array);
  expect(array).toEqual([1.2, 3.3, 4.2]);
});
