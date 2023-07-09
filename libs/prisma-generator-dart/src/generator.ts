import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { exec } from 'child_process';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { DartGenerator } from './generators/dart.generator';
import { generateDartEnum } from './generators/enum.generators';
import { DartGeneratorSettings } from './dart_settings.interface';
import { StringFns, outputToConsole, writeFileSafely, convertBooleanStrings } from '@shared';
import { dartInterfacesAndModelFunctionsStub } from './stubs/dart.stub';
import * as fs from 'fs';
import { DartStoreGenerator } from './generators/dart_store.generator';


const { version } = require('../package.json');

const defaultOptions: DartGeneratorSettings = {
    AutoGeneratedWarningText: '//***  AUTO-GENERATED FILE - DO NOT MODIFY ***// ',
    dryRun: false,
    schemaPath: '',
    EnumPath: 'enums',
    FormatWithDart: true,
    MakeAllPropsOptional: true,
    // ModelsImplementBaseClass: true,
    CommonSourceDirectory: 'common',
    ModelsBaseClassFileName: 'prisma_model.dart',
};

generatorHandler({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const configOverwrites = {
        schemaPath: options.schemaPath,
    };

    const settings: DartGeneratorSettings = {
        ...defaultOptions,
        ...convertBooleanStrings(options.generator.config),
        ...configOverwrites,
    };

    console.log('hello from dart gen');
    const mainGenerator = new MainGenerator(options, settings);
    await mainGenerator.generateFiles();
  }
})

class MainGenerator {

    //private dartFiles: string[] = [];
    private dartFiles: Record<string, string> = {};
    private dartStoreFiles: Record<string, string> = {};

    writeFile: (path: string, content: string) => void;
    outputPath: string;

    constructor(private options: GeneratorOptions, private settings: DartGeneratorSettings) {
        this.writeFile = settings.dryRun ? outputToConsole : writeFileSafely;
        this.outputPath = this.options.generator.output?.value as string;
    }

    async generateFiles(options = this.options, settings = this.settings) {

        /* if (settings.ModelsImplementBaseClass) {
            await this.writeModelBaseFile();
        } */

        for (const model of options.dmmf.datamodel.models) {        
            console.log(`Processing Model ${model.name}`); 
            await this.generateDartModelFile(model);
            await this.generateDartStoreFile(model);
        }

        for (const tEnum of options.dmmf.datamodel.enums) {
            console.log(`Processing Enum ${tEnum.name}`);
            await this.generateDartEnumFile(tEnum);
        }
        await this.createDartLibraryFile();
        if (this.settings.FormatWithDart) {
            const outputPath = options.generator.output?.value;
            exec(`dart format "${outputPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.log('dart format couldn\'t run. Make sure you have Dart installed properly by going to https://dart.dev/get-dart');
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }

        this.copyCommonSourceFiles();

        console.log('Done!');
    }

    async writeModelBaseFile() {
        const fileName = this.settings.ModelsBaseClassFileName;
        const filePath = path.join(this.outputPath, this.settings.CommonSourceDirectory, fileName);
        const code = dartInterfacesAndModelFunctionsStub;
        await this.writeFile(filePath, code);
    }

    async copyCommonSourceFiles() {
        console.log('Copying dart source files');
        console.log('__dirname', __dirname);
        const sourcePath = path.join(__dirname,  'dart_source');
        const targetPath = path.join(this.outputPath, this.settings.CommonSourceDirectory);
        console.log('sourcePath', sourcePath);
        console.log('targetPath', targetPath);
        await this.copyDirectoryAndContent(sourcePath, targetPath);
    }

    async copyDirectoryAndContent(source: string, target: string) {
        return fs.cp(source, target, {recursive: true}, (err) => {
            if (err) {
                console.log('Error copying dart source files', err);
                return;
            }
            console.log(`${source} was copied to ${target}`);
        });
    }

    async generateDartEnumFile(tEnum: DMMF.DatamodelEnum) {
        let content = generateDartEnum(tEnum, this.settings.AutoGeneratedWarningText);
        const fileName = `${StringFns.snakeCase(tEnum.name)}.dart`;
        const filePath = path.join(this.outputPath, fileName);
        console.log(` > Generating enum for Model ${tEnum.name}`);
        await this.writeFile(filePath, content);
        this.dartFiles[tEnum.name] = fileName;
    }

    async createDartLibraryFile() {
        let content = Object.keys(this.dartFiles).reduce((acc, key) => acc + `export '${this.dartFiles[key]}';\n`, "");
        // let content = this.dartFiles.reduce((acc, val) => acc + `export '${val}';\n`, "");
        const filePath = path.join(
            this.outputPath,
            `models_library.dart`
        );
        await this.writeFile(filePath, content);
    }

    async generateDartModelFile(model: DMMF.Model) {
        const dartGenerator = new DartGenerator(this.settings, model);
        const dartContent = dartGenerator.generateContent();
        const fileName = `${StringFns.snakeCase(model.name)}.dart`;
        const filePath = path.join(
            this.outputPath,
            fileName,
        );
        this.dartFiles[model.name] = fileName;
        console.log(` > Generating Dart class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }

    async generateDartStoreFile(model: DMMF.Model) {

        const dartStoreGenerator = new DartStoreGenerator(this.settings, model);
        const dartContent = dartStoreGenerator.generateContent();
        const fileName = `${StringFns.snakeCase(model.name)}_store.dart`;
        const filePath = path.join(
            this.outputPath,
            'stores',
            fileName,
        );
        this.dartStoreFiles[model.name] = fileName;
        console.log(` > Generating Dart Store class for Model ${model.name}`);
        await this.writeFile(filePath, dartContent);
    }
}
