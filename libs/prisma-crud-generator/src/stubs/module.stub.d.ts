export declare const moduleStub = "\n/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\nimport { Module } from '@nestjs/common';\nimport { #{ServiceName} } from './#{ServicePath}';\nimport { DictionariesController } from './dictionaries.controller';\n\n@Module({\n  controllers: [DictionariesController],\n  providers: [DictionariesService]\n})\nexport class DictionariesModule {}";
//# sourceMappingURL=module.stub.d.ts.map