import {ConstructorType} from "../interface/commonTypes";
import {Object3D} from "./Object3D";

export type Object3DGetter = () => Object3D;

export class Component {
  getObject3D: Object3DGetter;

  constructor(getObject3D: Object3DGetter) {
    this.getObject3D = getObject3D;
  }
  
  update() {}
}

export type ComponentConstructor<T extends Component>
  = ConstructorType<Object3DGetter, T>;
