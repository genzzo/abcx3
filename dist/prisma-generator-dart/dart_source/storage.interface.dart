part of abcx3_prisma;

abstract interface class StorageInterface<T> {
  void initStorage();

  List<T> getAll();

  void add(T item);

  void addMany(List<T> items);

  T? update(T item);

  List<T?> updateMany(List<T> items);

  T? upsert(T item);

  List<T?> upsertMany(List<T> items);

  void delete(T item);

  void deleteMany(List<T> items);
}

abstract interface class KeyStorageInterface<T, U> extends StorageInterface<T> {
  U? getKey(T item);

  T? getByKey(U key);

  List<T> getManyByKeys(List<U> keys);

  void deleteByKey(U key);

  void deleteManyByKeys(List<U> keys);
}
