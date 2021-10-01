import {Log} from "../utils/Log";
import {BufferGeometry} from "./BufferGeometry";
import {Material} from "./Material";
import {Renderer} from "./Renderer";
import {Transform} from "./Transform";

export abstract class AObject3D {
  transform: Transform = new Transform(this);
  
  renderer?: Renderer;

  abstract update(): void;
}

export class Object3D extends AObject3D {
  update() {
    Log.info('updating');
  }
}

export class RendererObject{
  geomrtry?: BufferGeometry;
  material?: Material;
  transform?: Transform;
}
