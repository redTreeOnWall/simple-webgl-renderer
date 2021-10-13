export class LinkData<T> {
  pre: LinkData<T> | null;
  next: LinkData<T> | null;
  data: T;
  constructor(d: T) {
    this.pre = null
    this.next = null
    this.data = d
  }
  addDataPreThis(d: T) {
    var data = new LinkData(d);
    data.next = this;
    data.pre = this.pre;
    this.pre = data;
  }
  addDataNextThis(d: T) {
    var data = new LinkData(d);
    data.pre = this;
    data.next = this.next;
    this.next = data;
  }
}

export class LinkedList<T> {
  id = "no name"
  _tail: LinkData<T> | null;
  _head: LinkData<T> | null;
  _isforEaching: boolean
  constructor(id?: string) {
    this._tail = null
    this._head = null
    this._isforEaching = false;
    if (id) {
      this.id = id
    }
  }
  addTail(d: T) {
    var data = new LinkData(d)
    if (this._tail === null) {
      this._head = data;
      this._tail = data;
    } else {
      this._tail.next = data
      data.pre = this._tail
      this._tail = data
    }
    return data;
  }
  addHead(d: T) {
    var data = new LinkData(d)
    if (this._head === null) {
      this._head = data;
      this._tail = data;
    } else {
      this._head.pre = data
      data.next = this._head
      this._head = data
    }
    return data;
  }
  removeHead() {
    var head = this._head;
    if (this._head === null) {
    } else {
      this.remove(this._head)
    }
    return head;
  }

  removeTail() {
    var tail = this._tail;
    if (this._tail === null) {
    } else {
      this.remove(this._tail)
    }
    return tail;
  }

  forEach(lambda: (t: LinkData<T>) => void) {
    var d = this._head;
    while (d !== null) {
      lambda(d)
      d = d.next;
    }
  }
  remove(linkData: LinkData<T>) {
    if (linkData.pre === null && linkData.next === null) {
      this._head = null;
      this._tail = null;
      return
    }

    if (linkData.pre === null) {
      this._head = linkData.next;
      (linkData.next as LinkData<T>).pre = null;
      return
    }

    if (linkData.next === null) {
      this._tail = linkData.pre;
      linkData.pre.next = null;
      return
    }

    linkData.pre.next = linkData.next;
    linkData.next.pre = linkData.pre;
  }

  findAndRemoveAll(data: T) {

    var count = 0;
    var d = this._head;
    while (d !== null) {
      if (d.data === data) {
        this.remove(d);
        count++;
      }
      d = d.next;
    }
    return count;
  }

  count() {
    var c = 0;
    this.forEach(() => c = c + 1)
    return c;
  }
  isEmpty() {
    return this._head === null
  }

  clear() {
    this._head = null;
    this._tail = null;
  }
}
