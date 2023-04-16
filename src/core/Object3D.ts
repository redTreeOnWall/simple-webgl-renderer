import {Mat4} from "../math/Mat4";
import {Component, ComponentConstructor} from "./Component";
import {ITreeNode} from "./ITreeNode";
import {RenderComponent} from "./RenderComponent";

export class Object3D implements ITreeNode{
  children: Object3D[] = [];
  private _parent: Object3D | null = null;
  _transformDirty = true;
  set transformDirty (value: boolean) {

    this.children.forEach(child => {
      child.transformDirty = true;
    });

    this._transformDirty = value;
  }
  get transformDirty() {
    return this._transformDirty;
  }

  private _transform: Mat4 = new Mat4();

  getTransform (outValue: Mat4 = new Mat4()) {
    return Mat4.copyAtoB(this._transform, outValue);
  }

  setTransform (value: Mat4) {
    this.transformDirty = true;
    Mat4.copyAtoB(value, this._transform);
  }

  private cachedGlobalTransform: Mat4 = new Mat4();

  getGlobaleTransform(outMat: Mat4 = new Mat4()) {
    if (this.transformDirty) {
      this.updateGlobalMatrix();
    }

    return Mat4.copyAtoB(this.cachedGlobalTransform, outMat);
  }

  setGlobalTransform(newTransform: Mat4) {
    // to local transform
    if (!this.parent) {
      Mat4.copyAtoB(newTransform, this._transform);
      return;
    }

    // TODO: Use cached object
    const parentTransform = this.parent.getGlobaleTransform();
    
    const invert = Mat4.inverse(parentTransform, new Mat4())
    
    Mat4.multiply(invert, parentTransform, new Mat4());
  }

  updateGlobalMatrix () {
    let parentTransform: Mat4 | null = null;

    if (this.parent) {
      parentTransform = this.parent.getGlobaleTransform();
    } else {
      parentTransform = new Mat4();
    }

    const newTransform = new Mat4();

    Mat4.multiply(parentTransform, this._transform, newTransform);
    Mat4.copyAtoB(newTransform, this.cachedGlobalTransform);
    this.transformDirty = false;
  }

  private components = new Map<ComponentConstructor<Component>, Component>();

  renderer: RenderComponent | null = null;

  private constructor() {}

  public static create() {
    return new Object3D();
  }

  get parent(): Object3D | null {
    return this._parent;
  }

  set parent(parent: Object3D | null) {
    if (parent !== null && parent.children.find(c => c === this)) {
      return;
    }

    if (this._parent) {
      this._parent.children = this._parent.children.filter(c => c !== this);
    }
    this._parent = parent;

    if (this._parent) {
      this._parent.children.push(this);
    }
  }

  addComponent<T extends Component>(componentClass: ComponentConstructor<T>): T {
    const com = this.components.get(componentClass);

    if (com) {
      return com as T;
    }

    const newComponent = new componentClass(() => this);

    this.components.set(componentClass, newComponent);

    return newComponent;
  }

  getComponent<T extends Component>(componentClass: ComponentConstructor<T>): T | null {
    const com = this.components.get(componentClass);

    if (com) {
      return com as T;
    }

    return null;
  }
  
  removeComponent<T extends Component>(componentClass: ComponentConstructor<T>) {
    const com = this.components.get(componentClass);

    if (com) {
      this.components.delete(componentClass);
    }
  }

  update () {
    this.components.forEach((c) => c.update());
  }
}
