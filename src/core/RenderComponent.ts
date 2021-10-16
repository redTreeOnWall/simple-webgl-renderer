import {BufferGeometry} from "./BufferGeometry";
import {Material} from "./Material";

export class RenderComponent {
  geometry: BufferGeometry;
  material: Material;

  constructor(geomrtry: BufferGeometry, material: Material) {
    this.geometry = geomrtry;
    this.material = material;
  }
}
