
export const dartStoreStub = `
#{AutoGeneratedWarningText}

part of '../abcx3_stores_library.dart';


class #{Model}Store extends ModelStreamStore<int, #{Model}> {

  static #{Model}Store? _instance;

  static #{Model}Store get instance {
    _instance ??= #{Model}Store();
    return _instance!;
  }

  #{Model}Store() : super(#{Model}.fromJson) {
    if (_instance != null) {
        throw Exception(
            '#{Model}Store is a singleton class and an instance of it already exists. '
                'This can happen if you are extending #{Model}Store, so it is recommended to NOT extend the store classes. '
                'Instead you should use #{Model}Store.instance to access the store instance. ');
      }
      _instance = this;
  }

  /// GET PROPERTIES FROM MODEL

  #{GetValMethods}

  /// GET THIS MODEL(S) BY PROPERTY VALUE

  #{GetByPropertyVal}

  #{GetManyByPropertyVal}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL

  #{GetRelatedModelsWithId}

  /// GET RELATED MODELS 

  #{GetRelatedModels}

  //////// STREAM METHODS //////////

  /// GET THIS MODEL as STREAM

  #{GetAll$}

  #{GetByPropertyVal$}

  #{GetManyByPropertyVal$}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL as STREAM

  #{GetRelatedModelsWithId$}

  /// GET RELATED MODELS as STREAM

  #{GetRelatedModels$}

}

#{ClassInclude}


enum #{Model}Endpoints implements Endpoint {

    #{Endpoints};

    const #{Model}Endpoints(this.path, this.method, this.responseType);

    @override
  final String path;

  @override
  final HttpMethod method;

  final Type responseType;

  static String withPathParameter(String path, dynamic param) {
    final regex = RegExp(r':([a-zA-Z]+)');
    return path.replaceFirst(regex, param.toString());
  }
}
`;

export const dartStoreClassIncludeStub = `
class #{Model}Include implements StoreIncludes {

    @override
    bool useCache;
    @override
    bool useAsync;
  
    @override
    late Function method;
  
      #{IncludeConstructors}
  }`;

export const dartStoreIncludesConstructor_old = `#{Model}Include.#{fieldName}({this.useCache = true, #{IncludeType} include}) {
    method = (#{moDel}) => #{Model}Store.instance.get#{FieldName}$(#{moDel}, useCache: useCache, include: include);
}`;
export const dartStoreIncludesConstructor = `#{Model}Include.#{fieldName}({this.useCache = true, this.useAsync = true, #{IncludeType} includes}) {
    if (useAsync) {
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}$(#{moDel}, useCache: useCache, includes: includes);
      } else {
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}(#{moDel}, includes: includes);
      }
}`;

export const dartStoreIncludesEmptyConstructor = `#{Model}Include.empty({this.useCache = true, this.useAsync = true});`;

export const dartStoreGetVal = `#{FieldType}#{Nullable} get#{Model}#{FieldName}(#{Model} #{moDel}) => #{moDel}.#{fieldName};`;


export const dartStoreGetAll$ = `Stream<List<#{Model}>> getAll$({bool useCache = true, List<#{Model}Include>? includes}) {
    final allItems$ = getAllItems$(endpoint: #{Model}Endpoints.#{EndPointAllName}, useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return allItems$;
      } else {
        return getManyIncluding$(allItems$, includes);
      }
    }
`;


export const dartStoreGetByPropertyVal = `#{Model}? getBy#{FieldName}(#{FieldType} #{fieldName}, {List<#{Model}Include>? includes}) => getIncluding(get#{Model}#{FieldName}, #{fieldName}, includes: includes);`;

export const dartStoreGetManyByPropertyVal_old = `List<#{Model}> getBy#{FieldName}(#{FieldType} #{fieldName}) => getManyByPropertyValue(get#{Model}#{FieldName}, #{fieldName});`;

export const dartStoreGetManyByPropertyVal = `List<#{Model}> getBy#{FieldName}(#{FieldType} #{fieldName}, {List<#{Model}Include>? includes}) => getManyIncluding(get#{Model}#{FieldName}, #{fieldName}, includes: includes);`;

export const dartStoreGetRelatedModelsWithId_old = `#{StreamReturnType} get#{FieldName}(#{Model} #{moDel}) => #{FieldType}Store.instance.getById(#{moDel}.#{relationFromField}!);`;

export const dartStoreGetRelatedModels_old = `#{StreamReturnType} get#{FieldName}(#{Model} #{moDel}) => #{RelatedModelStore}.instance.getBy#{RelationToFieldName}(#{moDel}.$uid!);`;



/// GET RELATED MODELS WITH ID STORED IN THIS MODEL:

export const dartStoreGetRelatedModelsWithId = `#{StreamReturnType} get#{FieldName}(#{Model} #{moDel}, {#{IncludeType} includes}) {
    final #{fieldName} = #{FieldType}Store.instance.getById(#{moDel}.#{relationFromField}!, includes: includes);
    #{moDel}.#{fieldName} = #{fieldName};
    // setIncludedReferences(#{fieldName}, includes: includes);
    return #{fieldName};
}`;


/// GET RELATED MODELS:

export const dartStoreGetRelatedModels = `#{StreamReturnType} get#{FieldName}(#{Model} #{moDel}, {#{IncludeType} includes}) {
    final #{fieldName} = #{RelatedModelStore}.instance.getBy#{RelationToFieldName}(#{moDel}.$uid!, includes: includes);
    #{moDel}.#{fieldName} = #{fieldName};
    // #{setRefModelFunction}(#{fieldName}, includes: includes);
    return #{fieldName};
}`;



export const dartStoreGetByPropertyVal$ = `Stream<#{Model}?> getBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true, List<#{Model}Include>? includes}) {
    final item$ = getByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Endpoints.#{EndPointName}, useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return item$;
    } else {
        return getIncluding$<#{Model}?>(item$, includes);
    }
}
`;

export const dartStoreGetManyByPropertyVal$ = `Stream<List<#{Model}>> getBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true, List<#{Model}Include>? includes}) {
    final items$ = getManyByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Endpoints.#{EndPointManyName}, useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return items$;
    } else {
        return getManyIncluding$<#{Model}>(items$, includes);
    }
}
`;



export const dartStoreGetRelatedModelsWithId$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} includes}) {
    return #{FieldType}Store.instance.getById$(#{moDel}.#{relationFromField}!, useCache: useCache, includes: includes)
        .doOnData((#{fieldName}) {
            #{moDel}.#{fieldName} = #{fieldName};
    });
}`;

export const dartStoreGetRelatedModels$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} includes}) {
    return #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(#{moDel}.$uid!, useCache: useCache, includes: includes)
            .doOnData((#{fieldName}) {
                #{moDel}.#{fieldName} = #{fieldName};
    });

}`;

/* export const dartStoreGetRelatedModelsWithId$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} include}) {
    Stream<#{StreamReturnType}> #{fieldName}$;
    if (#{moDel}.#{fieldName} != null && useCache) {
        #{fieldName}$ = Stream.value(#{moDel}.#{fieldName}!);
    } else {
        #{fieldName}$ = #{FieldType}Store.instance.getById$(#{moDel}.#{relationFromField}!, useCache: useCache)
            .doOnData((#{fieldName}) {
                #{moDel}.#{fieldName} = #{fieldName};
        });
    }
    if (include == null || include.isEmpty) {
        return #{fieldName}$;
    } else {
        return #{getIncluding$}<#{GetIncludingType}>(#{fieldName}$, include);
    }
}`;

export const dartStoreGetRelatedModels$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} include}) {
    Stream<#{StreamReturnType}> #{fieldName}$;
    if (#{moDel}.#{fieldName} != null && useCache) {
        #{fieldName}$ = Stream.value(#{moDel}.#{fieldName}!);
    } else {
        #{fieldName}$ = #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(#{moDel}.$uid!, useCache: useCache)
            .doOnData((#{fieldName}) {
                #{moDel}.#{fieldName} = #{fieldName};
        });
    }
    if (include == null || include.isEmpty) {
        return #{fieldName}$;
    } else {
        return #{getIncluding$}<#{GetIncludingType}>(#{fieldName}$, include);
    }
}`; */

/* export const dartStoreGetRelatedModelsWithId$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} include}) {
    if (#{moDel}.#{fieldName} != null && useCache) {
        return Stream.value(#{moDel}.#{fieldName}!);
      } else {
        final item$ = #{FieldType}Store.instance.getById$(#{moDel}.#{relationFromField}!)
            .doOnData((#{fieldName}) {
                #{moDel}.#{fieldName} = #{fieldName};
        });
        if (include == null || include.isEmpty) {
            return item$;
        } else {
            return #{getIncluding$}<#{GetIncludingType}>(item$, include);
        }
      }
}`; */

/* export const dartStoreGetRelatedModels$ = `Stream<#{StreamReturnType}> get#{FieldName}$(#{Model} #{moDel}, {bool useCache = true, #{IncludeType} include}) {
    if (#{moDel}.#{fieldName} != null && useCache) {
        return Stream.value(#{moDel}.#{fieldName}!);
      } else {
        final items$ = #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(#{moDel}.$uid!)
            .doOnData((#{fieldName}) {
                #{moDel}.#{fieldName} = #{fieldName};
        });
        if (include == null || include.isEmpty) {
            return items$;
        } else {
            return #{getIncluding$}<#{GetIncludingType}>(items$, include);
        }
      }
}`; */


export const dartStoreEndpointName = `getBy#{FieldName}`;

export const dartStoreEndpointManyName = `getManyBy#{FieldName}`;

export const dartStoreEndpointAllName = `getAll`;

export const dartStoreEndpoint = `#{EndPointName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.get, #{Model})`;

export const dartStoreEndpointMany = `#{EndPointManyName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.get, List<#{Model}>)`;

export const dartStoreEndpointAll = `#{EndPointAllName}('/#{moDel}', HttpMethod.get, List<#{Model}>)`;



