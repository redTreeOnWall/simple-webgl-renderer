
import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";
import {ITreeNode} from "./ITreeNode";
import {Object3D} from "./Object";

export class Transform implements ITreeNode{
  parent : Transform | null = null;
  children : Transform[] = [];

  localMat4: Mat4 = new Mat4();

  // TODO: dirt check
  worldMatrix4: Mat4 = new Mat4();
  object: Object3D | null = null;

  // FIXME
  position: Vec3 = new Vec3();
}
