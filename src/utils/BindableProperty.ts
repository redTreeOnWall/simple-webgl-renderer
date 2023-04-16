export type PropertyChangeListener<T> = (newVaue: T, oldValue: T) => void;

export class BindableProperty<T> {
  private _value: T;

  get value() {
    return this._value;
  }

  set value(newVaue: T) {
    const oldValue = this._value;
    this._value = newVaue;

    this.listeners.forEach((listener) => {
      listener(newVaue, oldValue);
    });
  }

  private listeners = new Set<PropertyChangeListener<T>>();

  constructor(
    defaultValue: T,
    listener: PropertyChangeListener<T> | undefined = undefined
  ) {
    this._value = defaultValue;
    if (listener) {
      this.addListener(listener);
    }
  }

  addListener(listener: PropertyChangeListener<T>) {
    this.listeners.add(listener);
  }

  removeList(listener: PropertyChangeListener<T>) {
    this.listeners.delete(listener);
  }
}
