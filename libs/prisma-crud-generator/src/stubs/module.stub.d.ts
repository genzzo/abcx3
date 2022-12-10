export declare const moduleStub = "\n/*****    AUTO-GENERATED FILE - DO NOT MODIFY   *****/\n\nimport { Module } from '@nestjs/common';\nimport { #{ServiceName} } from './#{ServiceFileName}';\nimport { #{ControllerName} } from './#{ControllerFileName}';\n\n@Module({\n  controllers: [#{ControllerName}],\n  providers: [#{ServiceName}]\n})\nexport class #{Model}Module {}";
//# sourceMappingURL=module.stub.d.ts.map