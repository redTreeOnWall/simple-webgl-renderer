import {Mat4} from "../math/Mat4";
import {Component, Object3DGetter} from "./Component";


export class Camera extends Component {
  viewMatrix: Mat4 = new Mat4();
  projection: Mat4 = new Mat4();
  viewProjectionMatrix: Mat4 = new Mat4();

  constructor(getter: Object3DGetter) {
    super(getter);
    this.setParams(1);
  }

  setParams(
    aspect: number,
    fov = Math.PI / 3,
    near = 0.1,
    far = 1000,
  ) {
    this.projection = Mat4.perspective(fov, aspect, near, far, this.projection);
  }

  updateViewProjectionMatrix() {
    // TODO dirt check
    Mat4.inverse(this.getObject3D().cachedWorldTransform, this.viewMatrix);
    Mat4.multiply(this.projection, this.viewMatrix, this.viewProjectionMatrix);
  }

  update(): void {}
}

