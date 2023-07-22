export const ServiceStub = `
#{AutoGeneratedWarningText}

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, #{Model} #{RelatedFieldTypesImport} } from '@prisma/client';
import {
    PrismaService,
} from '#{PrismaServiceImportPath}';
#{NeverthrowImport}

@Injectable()
export class #{ServiceClassName} {
    constructor(protected readonly prismaService: PrismaService) {}

    async getAll(): Promise<#{Model}[] | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findMany();
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get all #{Model}.\`
            );
        }
    }

    async getByFieldValues(fieldsAndValues: Record<string, number | string>): Promise<#{Model} | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findFirst({
                where: fieldsAndValues
            });
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get one #{Model} by \${this.printObject(fieldsAndValues)}}\`
            );
        }
    }

    async getManyByFieldValues(fieldsAndValues: Record<string, number | string>): Promise<#{Model}[] | Error> {
        try {
            const result = await this.prismaService.#{moDel}.findMany({
                where: fieldsAndValues
            });
            return result;
        } catch (e) {
            return new InternalServerErrorException(
                \`Could not get any #{Model} by \${this.printObject(fieldsAndValues)}}\`
            );
        }
    }

    // get by id methods

    #{byIdMethods}

    // relation fields methods

    #{relationFieldMethods}

    printObject = (obj: any) => JSON.stringify(obj, null, 2);

}
`;

export const NeverthrowImport = `import { err, ok, Result } from 'neverthrow';`;

export const crudRelationFieldStub = `
async get#{RelationFieldNameCapitalized}(where: Prisma.#{Model}WhereUniqueInput): Promise<#{RelationMethodReturnType} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.findUnique({
            where,
            include: { #{RelationFieldName} : true },
        });
        return result.#{RelationFieldName};
    } catch (e) {
        return new InternalServerErrorException(\`Could not get #{RelationFieldName} for #{Model}\`);
    }
}
`;

export const idMethods_neverThrow = `
async getById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
        where: { #{idName} }
    });
    return result;
    } catch(e) {
    return new NotFoundException(\`#{Model} Resource \${id} was not found\`);
    }
}

async updateById(#{idName}: #{idType}, data: Prisma.#{Model}UpdateInput): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.update({
            where: { #{idName} },
            data: data,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not update #{Model} Resource \${#{idName}}\`);
    }
}

async deleteById(#{idName}: #{idType}): Promise<#{Model} | Error> {
    try {
        const result = await this.prismaService.#{moDel}.delete({ where: { #{idName} } });
        return result;
    } catch (e) {
        return new InternalServerErrorException(\`Could not delete #{Model} Resource \${#{idName}}\`);
    }
}
`;

