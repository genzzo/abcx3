import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator } from './generators/crud.service.generator';
import { GeneratorSettings } from './interfaces/generator.interface';
import { version } from './../package.json';
import { InputGenerator } from './generators/input.generator';
import { outputToConsole, writeFileSafely } from './utils/writeFileSafely';
import path = require('path');
import { lowerCaseFirstChar } from './utils/utils';
import { generateEnum } from './generators/enum.generator';
import { ControllerGenerator } from './generators/controller.generator';

const defaultOptions: GeneratorSettings = {
    strict: 'false',
    dryRun: 'false',

    schemaPath: '',

    GenerateInputs: 'true',
    GenerateInputSwagger: 'true',
    InputExportPath: 'data/inputs',
    InputSuffix: 'Input',
    InputValidatorPackage: 'class-validator',

    InputParentClass: undefined,
    InputParentClassPath: undefined,

    InputCreatePrefix: 'Create',
    InputUpdatePrefix: 'Update',

    GenerateServices: 'true',
    GenerateController: 'true',
    GenerateModule: 'true',
    CRUDServicePath: 'services',
    CRUDServiceSuffix: 'CrudService',
    CRUDStubFile: undefined,
    CRUDAddExceptions: 'true',
    PrismaServiceImportPath: '@modded-prisma-utils/nestjs-prisma',

    EnumPath: 'enums'
};

generatorHandler({
    onManifest() {
        console.log(`${GENERATOR_NAME}:Registered`);
        return {
            version,
            defaultOutput: '../generated',
            prettyName: GENERATOR_NAME,
        };
    },
    onGenerate: async (options: GeneratorOptions) => {
        const configOverwrites = {
            schemaPath: options.schemaPath,
        };

        const settings: GeneratorSettings = {
            ...defaultOptions,
            ...options.generator.config,
            ...configOverwrites,
        };

        const mainGenerator = new MainGenerator(options, settings);
        await mainGenerator.generateFiles();
    }
});


class MainGenerator {

    private dartFiles: string[] = [];
    private writeFile: (path: string, content: string) => void;

    constructor(private options: GeneratorOptions, private settings: GeneratorSettings) {
        this.writeFile = settings.dryRun === 'false' ? writeFileSafely : outputToConsole;
    }

    getServiceClassName = (model: DMMF.Model) => `${model.name}${this.settings.CRUDServiceSuffix}`;
    getControllerClassName = (model: DMMF.Model) => `${model.name}Controller`;

    async generateFiles(options = this.options, settings = this.settings) {

        for (const model of options.dmmf.datamodel.models) {        
            console.log(`Processing Model ${model.name}`);
            if (settings.GenerateServices === 'true') {
                await this.generateCrudFile(model);
            }

            if (this.settings.GenerateInputs === 'true') {
                await this.generateInputFile(model);
            }

            if (this.settings.GenerateController.toLowerCase() === 'true') {
                await this.generateControllerFile(model);
            }
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateEnumFile(tEnum);
        }
    }

    async generateEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateEnum(tEnum);
        let outputPath  = this.getModelPath(tEnum.name);
        const filePath = path.join(outputPath, this.settings.EnumPath, `${tEnum.name.toLowerCase()}.ts`);
        await this.writeFile(filePath, content);
    }

    async generateInputFile(model: DMMF.Model) {
        let basePath = this.getModelPath(model.name);
        const inputGenerator = new InputGenerator(this.settings, model);
        const inputContent = await inputGenerator.generateContent();
    
        const filePath = path.join(
            basePath,
            this.settings.InputExportPath,
            `${model.name.toLowerCase()}.input.ts`
        );
        await this.writeFile(filePath, inputContent);
    }

    async generateCrudFile(model: DMMF.Model) {
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = this.getServiceClassName(model);
        const crudServiceGenerator = new CrudServiceGenerator(
            this.settings,
            model,
            crudServiceName,
        );
        const crudServiceContent = await crudServiceGenerator.generateContent();
        const filePath = path.join(this.getModelPath(model.name), this.settings.CRUDServicePath, `${lowerCaseFirstChar(model.name)}.service.ts`);
        await this.writeFile(filePath, crudServiceContent);
    }

    async generateControllerFile(model: DMMF.Model) {
        const controllerClassName = this.getControllerClassName(model);
        const controllerGenerator = new ControllerGenerator(
            this.settings,
            model,
            controllerClassName
        );
        const controllerContent = await controllerGenerator.generateContent();
        const filePath = path.join(this.getModelPath(model.name), `${lowerCaseFirstChar(model.name)}.controller.ts`);
        await this.writeFile(filePath, controllerContent);
    }


    private getModelPath(modelName: string) {
        let tPath = this.options.generator.output?.value;
        tPath = tPath?.replace(/#{Model}/g, modelName);
        tPath = tPath?.replace(/#{model}/g, modelName.toLowerCase());
        tPath = tPath?.replace(/#{MODEL}/g, modelName.toUpperCase());
        tPath = tPath?.replace(/#{moDel}/g,lowerCaseFirstChar(modelName));
        return tPath || '';
    }
}

