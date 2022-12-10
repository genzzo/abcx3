export const controllerStub = `
/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { #{CrudServiceName} } from './#{CrudServiceFileName}';
#{ImportGuardClass}

@Controller('#{model}')
export class #{ControllerClassName} {
  constructor(private readonly service: #{CrudServiceName}) {}

  #{GuardDecorator}
  @Post()
  create(@Body() #{moDel}CreateInput: Prisma.#{Model}CreateInput) {
    return this.service.create(#{moDel}CreateInput);
  }

  #{GuardDecorator}
  @Get()
  getAll() {
    return this.service.getAll();
  }

  #{GuardDecorator}
  @Post()
  getFiltered(@Body() data: Prisma.#{Model}FindManyArgs) {
    return this.service.getFiltered(data);
  }

  #{GuardDecorator}
  @Post()
  getUnique(@Body() body: Prisma.#{Model}FindUniqueOrThrowArgs) {
    return this.service.getUnique(body);
  }

  #{GuardDecorator}
  @Post()
  update(@Body() body: {where: Prisma.#{Model}WhereUniqueInput; data: Prisma.#{Model}UpdateInput}) {
    return this.service.update( body.where, body.data);
  }

  #{GuardDecorator}
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(+id);
  }

  #{GuardDecorator}
  @Patch(':id')
  updateById (@Param('id') id: string, @Body() data: Prisma.#{Model}UpdateInput) {
    return this.service.updateById(+id, data);
  }

  #{GuardDecorator}
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(+id);
  }
}`