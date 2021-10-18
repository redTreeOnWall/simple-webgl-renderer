import {Vec3} from "../src/math/Vec3";

test( 'vec3 scale', () => {
  const v1 = new Vec3();
  v1.set(1, 2, 3);

  Vec3.scale(v1, 2, v1);
  
  const result = new Vec3();
  result.set(2, 4, 6);

  expect(v1).toEqual(result);
});
