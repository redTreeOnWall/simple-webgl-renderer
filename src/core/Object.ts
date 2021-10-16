import {Log} from "../utils/Log";
import {BufferGeometry} from "./BufferGeometry";
import {Material} from "./Material";
import {RenderComponent} from "./RenderComponent";
import {Transform} from "./Transform";

export abstract class AObject3D {
  name: string;

  transform: Transform = new Transform(this);
  
  renderer?: RenderComponent;

  constructor(name?: string) {
    if(name !== undefined) {
      this.name = name;
    } else {
      this.name = 'object3D';
    }
  }

  abstract update(): void;
}

export class Object3D extends AObject3D {
  update() {}
}

export class RendererObject{
  geomrtry?: BufferGeometry;
  material?: Material;
  transform?: Transform;
}
