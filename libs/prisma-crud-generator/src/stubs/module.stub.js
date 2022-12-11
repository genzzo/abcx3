"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleStub = void 0;
exports.moduleStub = `
#{AutoGeneratedWarningText}

import { Module } from '@nestjs/common';
import { #{ServiceName} } from './#{ServiceFileName}';
import { #{ControllerName} } from './#{ControllerFileName}';
import { #{PrismaModuleName} } from '#{PrismaModuleImportPath}';

@Module({
  controllers: [#{ControllerName}],
  providers: [#{ServiceName}],
  imports: [#{PrismaModuleName}]
})
export class #{Model}Module {}`;
//# sourceMappingURL=module.stub.js.map