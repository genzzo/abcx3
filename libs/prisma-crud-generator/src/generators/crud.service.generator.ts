import { GeneratorSettings } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
    crudServiceStub,
    crudServiceStubWithExceptions,
    idMethods_neverThrow
} from './../stubs/crud.service.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';
import { PrismaHelper } from '../helpers/prisma.helper';

export class CrudServiceGenerator {
    constructor(
        private config: GeneratorSettings,
        private model: DMMF.Model,
        private className: string,
    ) { }

    public async generateContent() {
        let crudServiceContent: string;

        if (this.config.CRUDAddExceptions === 'true') {
            crudServiceContent = crudServiceStubWithExceptions;
        } else {
            crudServiceContent = crudServiceStub;
        }

        if (this.config.CRUDStubFile) {
            const stubFullPath = path.join(
                this.config.schemaPath,
                this.config.CRUDStubFile,
            );
            console.log(`Loading Stubs from ${stubFullPath}`);

            const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
            crudServiceContent = customStub.toString();
        }

        // replace variables

        const idFieldAndType = PrismaHelper.getInstance().getIdFieldNameAndType(this.model);

        if (idFieldAndType) {

            crudServiceContent = crudServiceContent.replace(
                /#{byIdMethods}/g,
                idMethods_neverThrow
            );

            crudServiceContent = crudServiceContent.replace(
                /#{idName}/g,
                idFieldAndType.name
            );

            crudServiceContent = crudServiceContent.replace(
                /#{idType}/g,
                idFieldAndType.type
            );

            crudServiceContent = crudServiceContent.replace(
                /#{uniqueInputType}/g,
                `Prisma.${this.model.name}WhereUniqueInput`
            );

            crudServiceContent = crudServiceContent.replace(
                /#{uniqueKeyAndVal}/g,
                "uniqueProps"
            );

            // #{uniqueKeyAndVal}

        } else {
            crudServiceContent = crudServiceContent.replace(
                /#{byIdMethods}/g,
                ''
            );

            let compoundkey = PrismaHelper.getInstance().getUniqueInputPropertyName(this.model);
            let compoundType = PrismaHelper.getInstance().getUniqueInputType(this.model);
            let prismaCompoundInputType = `Prisma.${this.model.name}${compoundType}CompoundUniqueInput`;
            
            crudServiceContent = crudServiceContent.replace(
                /#{uniqueInputType}/g,
                prismaCompoundInputType
            );

            crudServiceContent = crudServiceContent.replace(
                /#{uniqueKeyAndVal}/g,
                `{${compoundkey}: uniqueProps}`
            );




        }

        crudServiceContent = crudServiceContent.replace(
            /#{CrudServiceClassName}/g,
            this.className,
        );

        crudServiceContent = crudServiceContent.replace(
            /#{Model}/g,
            this.model.name,
        );
        crudServiceContent = crudServiceContent.replace(
            /#{MODEL}/g,
            this.model.name.toUpperCase(),
        );
        crudServiceContent = crudServiceContent.replace(
            /#{model}/g,
            this.model.name.toLowerCase(),
        );
        crudServiceContent = crudServiceContent.replace(
            /#{moDel}/g,
            lowerCaseFirstChar(this.model.name),
        );

       


        return crudServiceContent;
    }




}


