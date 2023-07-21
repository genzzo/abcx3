part of abcx3_stores;

enum HttpMethod { get, post, put, patch, delete }

abstract class Endpoint {
  abstract final String path;
  abstract final HttpMethod method;
}

abstract interface class HttpService {
  Future<Result<T, DioException>> request<T>(
    Endpoint endpoint, {
    dynamic param,
    valueOnError,
    String? token,
    Map<String, dynamic>? headers,
    Object? body = const {},
  });
}

abstract interface class StoreIncludes {
  abstract bool useCache;
  abstract Function method;
}