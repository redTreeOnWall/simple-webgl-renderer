import {forEachTreeNode} from "./ITreeNode";
import {AObject3D} from "./Object";
import {Transform} from "./Transform";

export class WebglRenderer {

  renderSence(root: Transform) {
    this.clear();

    forEachTreeNode(root, (node) => {
      // TODO: update matrix
    });

    forEachTreeNode(root, (node) => {
      if(node.object !== null) {
        node.object.update();
        this.renderOneObject(node.object);
      }
    });

    forEachTreeNode(root, (node) => {
      if(node.object !== null) {
        this.renderOneObject(node.object);
      }
    });

  }

  clear() {

  }

  renderOneObject (obj: AObject3D) {
    
  }

  updateState() {

  }

  updateUniforms() {

  }

  draw() {

  }
}
