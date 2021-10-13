import { Mat4 } from "../math/Mat4";
import {ITreeNode} from "./ITreeNode";
import {AObject3D, Object3D} from "./Object";

export class Transform implements ITreeNode{
  parent : this | null = null;
  children : this[] = [];

  localMat4: Mat4 = new Mat4();
  worldMat4: Mat4 = new Mat4();
  // TODO: dirt check
  object: Object3D | null = null;

  constructor(object: AObject3D | null) {
    this.object = object;
  }
}
