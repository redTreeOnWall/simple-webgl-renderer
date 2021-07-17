
import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";

export class Transform{
  parent? : Transform;
  children? : Array<Transform>;
  localMat4: Mat4 = new Mat4();

  //FIXME
  position: Vec3 = new Vec3();
}
