import { Controller, Get, Post, Body, Res, Param, Request, ParseIntPipe } from '@nestjs/common';

import { MaterialService } from './material.service';

import * as bcrypt from 'bcrypt';
import { Response } from "express";
import {FilterAuthDto} from "../auth/dto/filter-auth.dto";

@Controller('api/material')
export class MaterialController {
  constructor(
    private materialService: MaterialService,
  ) {}

  @Post('create')
  async createMaterial(
    @Body('createDate') createDate: string,
    @Body('saveDate') saveDate: string,
    @Body('text') text: string,
    @Body('header') header: string,
    @Body('creatorId') creatorId: string,
    @Body('editingId') editingId: string,
  ) {
    const material = await this.materialService.createMaterial({
      createDate,
      saveDate,
      text,
      header,
      creatorId,
      editingId
    });

    return material;
  }

  @Get('get')
  async getMaterials() {
    return this.materialService.getMaterials();
  }

  @Get(':id')
  async getMaterialsById(@Request() req, @Param('id') id: string) {
    return this.materialService.getMaterialByEditing(id);
  }
}