export declare const crudServiceStubWithExceptions = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport {\n  Injectable,\n  InternalServerErrorException,\n  NotFoundException,\n} from '@nestjs/common';\nimport { Prisma, #{Model} } from '@prisma/client';\nimport {\n  PaginationInterface,\n  PrismaService,\n} from '@modded-prisma-utils/nestjs-prisma';\nimport { err, ok, Result } from 'neverthrow';\n\n@Injectable()\nexport class #{CrudServiceClassName} {\n  constructor(private readonly prismaService: PrismaService) {}\n\n  getPrisma() {\n    return this.prismaService;\n  }\n\n  async getAll(\n    filter?: Prisma.#{Model}FindManyArgs,\n  ): Promise<Result<PaginationInterface<#{Model}>, Error>> {\n    try {\n      const [items, count] = await this.prismaService.$transaction([\n        this.prismaService.#{moDel}.findMany(filter),\n        this.prismaService.#{moDel}.count({ where: filter?.where }),\n      ]);\n\n      const take = filter?.take ? filter?.take : count;\n      const skip = filter?.skip ? filter?.skip : 0;\n\n      return ok({\n        items: items,\n        meta: {\n          totalItems: count,\n          items: items.length,\n          totalPages: Math.ceil(count / take),\n          page: skip / take + 1,\n        },\n      });\n    }\n    catch(e) {\n      return err(new InternalServerErrorException(`Could not get #{Model} Resources.`));\n    }\n  }\n\n  async getById(id: #{modelsIdType}): Promise<Result<#{Model}, Error>> {\n    try {\n      const result = await this.prismaService.#{model}.findUniqueOrThrow({\n        where: { id: id }\n      });\n      return ok(result);\n    } catch(e) {\n      return err(new NotFoundException(`#{Model} Resource ${id} was not found.`));\n    }\n  }\n\n  async create(data: Prisma.#{Model}CreateInput): Promise<Result<#{Model}, Error>> {\n    try {\n      const result = await this.prismaService.#{moDel}.create({ data: data });\n      return ok(result);\n    } catch (e) {\n      return err(new InternalServerErrorException(`Could not create #{Model} Resource.`));\n    }\n  }\n\n  async update(\n    id: #{modelsIdType},\n    data: Prisma.#{Model}UpdateInput,\n  ): Promise<Result<#{Model}, Error>> {\n    try {\n      const result = await this.prismaService.#{moDel}.update({\n        where: { id: id },\n        data: data,\n      });\n      return ok(result);\n    } catch (e) {\n      return err(new InternalServerErrorException(\n        `Could not update #{Model} Resource ${id}.`,\n      ));\n    }\n  }\n\n  async delete(id: #{modelsIdType}): Promise<Result<#{Model}, Error>> {\n    try {\n      const result = await this.prismaService.#{moDel}.delete({ where: { id: id } });\n      return ok(result);\n    } catch (e) {\n      return err(new InternalServerErrorException(\n        `Could not delete #{Model} Resource ${id}.`,\n      ));\n    }\n  }\n}\n";
export declare const crudServiceStub = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport { Injectable } from '@nestjs/common';\nimport { Prisma, #{Model} } from '@prisma/client';\nimport {\n  PaginationInterface,\n  PrismaService,\n} from '@prisma-utils/nestjs-prisma';\n\n@Injectable()\nexport class #{CrudServiceClassName} {\n  constructor(private readonly prismaService: PrismaService) {}\n\n  getPrisma() {\n    return this.prismaService;\n  }\n\n  async getAll(\n    filter?: Prisma.#{Model}FindManyArgs,\n  ): Promise<PaginationInterface<#{Model}>> {\n    const [items, count] = await this.prismaService.$transaction([\n      this.prismaService.#{moDel}.findMany(filter),\n      this.prismaService.#{moDel}.count({ where: filter?.where }),\n    ]);\n\n    const take = filter?.take ? filter?.take : count;\n    const skip = filter?.skip ? filter?.skip : 0;\n\n    return {\n      items: items,\n      meta: {\n        totalItems: count,\n        items: items.length,\n        totalPages: Math.ceil(count / take),\n        page: skip / take + 1,\n      },\n    };\n  }\n\n  async getById(id: #{modelsIdType}): Promise<#{Model}> {\n    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({\n      where: { id: id }\n    });\n    return result;\n  }\n\n  async create(data: Prisma.#{Model}CreateInput): Promise<#{Model}> {\n    const result = await this.prismaService.#{moDel}.create({ data: data });\n    return result;\n  }\n\n  async update(\n    id: #{modelsIdType},\n    data: Prisma.#{Model}UpdateInput,\n  ): Promise<#{Model}> {\n    return await this.prismaService.#{moDel}.update({\n      where: { id: id },\n      data: data,\n    });\n  }\n\n  async delete(id: #{modelsIdType}): Promise<#{Model}> {\n    return await this.prismaService.#{moDel}.delete({ where: { id: id } });\n  }\n}\n";
//# sourceMappingURL=crud.service.stub.d.ts.map