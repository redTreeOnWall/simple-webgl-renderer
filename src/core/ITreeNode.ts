import {LinkData, LinkedList} from "../utils/LinkedList";

export interface ITreeNode {
  children: ITreeNode[];
  parent: ITreeNode | null;
}

export const forEachTreeNode= <T extends ITreeNode>(root: T, func: (node: T) => void) => {
  const stack: T[] = [];
  stack.push(root);

  while (stack.length > 0) {
    const top = stack.pop() as T;

    // TODO remove out of loop
    func(top);

    for(let i = top.children.length - 1; i >= 0; i -= 1) {
      const child = top.children[i] as T;
      stack.push(child);
    }
  }

}
