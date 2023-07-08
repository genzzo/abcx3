part of abcx3_prisma;

class ModelStreamStore<U, T extends UID<U>> extends ModelStore<U, T> {
  ModelStreamStore(JsonModelFactory<T> fromJson) : super(fromJson);

  final BehaviorSubject<List<T>> _items$$ = BehaviorSubject.seeded([]);
  late final Stream<List<T>> items$ = _items$$.stream;

  @override
  get items => _items$$.value;

  @override
  set items(List<T> items) => _items$$.add(items);

  getById$(U id, {bool useCache = true}) =>
      getByFieldValue$(getPropVal: getId, fieldValue: id, useCache: useCache);

  Stream<T?> getByFieldValue$<W>(
      {required GetPropertyValue<T, W> getPropVal,
        required dynamic fieldValue,
        bool useCache = true}) {
    if (useCache) {
      final model = getByPropertyValue(getPropVal, fieldValue);
      if (model != null) {
        return Stream.value(model);
      }
    }
    return getOne$(
        endpoint: Abc3Route.player_byGameId_$gameId_get, param: fieldValue)
        .doOnData((model) => add(model));
  }

  getManyByFieldValue$<K>({
    required GetPropertyValue<T, K> getPropVal,
    required dynamic value,
    required Endpoint endpoint,
    bool useCache = true,
  }) {
    if (useCache) {
      final models = getManyByPropertyValue<K>(getPropVal, value);
      if (models.isNotEmpty) {
        return Stream.value(models);
      }
    }
    return getMany$<T>(endpoint: endpoint, param: value)
        .doOnData((models) => addMany(models));
  }
}