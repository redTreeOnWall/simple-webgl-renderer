
export class Vec3{
  x: number = 0 ;
  y: number = 0;
  z: number = 0;

  set (x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static add (v1: Vec3, v2: Vec3, result: Vec3) {
    result.set(
      v1.x + v2.x,
      v1.y + v2.y,
      v1.z + v2.z,
    );
    return result;
  }

  static scale(v: Vec3, scale: number, result: Vec3) {
    result.set(
      v.x * scale,
      v.y * scale,
      v.z * scale,
    );
    return result;
  }
}
