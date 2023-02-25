import {Mat4} from "../math/Mat4";
import {BufferGeometry} from "./BufferGeometry";
import {Component, ComponentConstructor} from "./Component";
import {ITreeNode} from "./ITreeNode";
import {Material} from "./Material/Material";
import {RenderComponent} from "./RenderComponent";
import {Transform} from "./Transform";

export class Object3D implements ITreeNode{
  children: Object3D[] = [];
  private _parent: Object3D | null = null;

  transform: Mat4 = new Mat4();

  cachedWorldTransform: Mat4 = new Mat4();

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

export class RendererObject{
  geomrtry?: BufferGeometry;
  material?: Material;
  transform?: Transform;
}
