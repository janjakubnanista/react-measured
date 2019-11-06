type ValueFactory<T> = () => T;

export function lazyValue<T>(valueFactory: ValueFactory<T>): ValueFactory<T> {
  let initialised = false;
  let value: T;

  return (): T => {
    if (!initialised) {
      value = valueFactory();
      initialised = true;
    }

    return value;
  };
}
