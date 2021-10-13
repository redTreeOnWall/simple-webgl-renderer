import {LinkData, LinkedList} from "../utils/LinkedList";

export interface ITreeNode {
  children: this[];
  parent: this | null;
}

export const forEachTreeNode= <T extends ITreeNode>(root: T, func: (node: T) => void) => {
  const queue: LinkedList<T> = new LinkedList();
  queue.addTail(root);

  while (!queue.isEmpty()) {
    const head = (queue.removeHead() as LinkData<T>).data as T;

    // TODO remove out of loop
    func(head);

    for(let i = 0; i< head.children.length; i++) {
      const child = head.children[i];
      queue.addTail(child);
    }
  }

}
