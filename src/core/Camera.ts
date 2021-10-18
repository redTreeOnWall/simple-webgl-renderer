import {Mat4} from "../math/Mat4";
import {AObject3D} from "./Object";

export class Camera extends AObject3D {
  viewMatrix: Mat4 = new Mat4();
  projection: Mat4 = new Mat4();
  viewProjectionMatrix: Mat4 = new Mat4();

  constructor(
    aspect: number,
    fov = Math.PI / 3,
    near = 0.1,
    far = 1000,
    name = 'camera',
  ) {
    super(name);
    this.projection = Mat4.perspective(fov, aspect, near, far, this.projection);
  }

  updateViewProjectionMatrix() {
    // TODO dirt check
    Mat4.inverse(this.transform.worldMat4, this.viewMatrix);
    Mat4.multiply(this.projection, this.viewMatrix, this.viewProjectionMatrix);
  }

  update(): void {}
}
