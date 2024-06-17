import { Controller, Get, Post, Body, Param, Request, Patch } from '@nestjs/common';
import { MaterialService } from './material.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('api/material')
export class MaterialController {
  constructor(
    private materialService: MaterialService,
    @InjectRedis() private readonly redis: Redis,
    private readonly socket: SocketGateway,
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
    return await this.materialService.createMaterial({
      createDate,
      saveDate,
      text,
      header,
      creatorId,
      editingId,
    });
  }

  @Get('get')
  async getMaterials() {
    return this.materialService.getMaterials();
  }

  @Get(':id')
  async getMaterialsById(@Request() req, @Param('id') id: string) {
    return this.materialService.getMaterialByEditing(id);
  }

  @Get('check-version/:id')
  async getLastVersion(@Request() req, @Param('id') id: string) {
    const version = await this.redis.get(`material:version-${id}`);
    let content;
    if (version)
      content = await this.redis.get(`material:content-${id}-${version}`);

    console.log({ version, content });

    return { version, content };
  }

  @Post('getOrCreate')
  async getOrCreate(
    @Body('createDate') createDate: string,
    @Body('saveDate') saveDate: string,
    @Body('text') text: string,
    @Body('header') header: string,
    @Body('creatorId') creatorId: string,
    @Body('editingId') editingId: string,
  ) {
    const material = {
      createDate,
      saveDate,
      text,
      header,
      creatorId,
      editingId,
    };

    return this.materialService.getOrCreate(material);
  }

  @Post('saveMaterialContent')
  async saveMaterialContent(
    @Body('editingId') editingId: string,
    @Body('userId') userId: number,
    @Body('content') content: string,
    @Body('snapshot') snapshot: string,
    @Body('timestamp') timestamp: string,
  ) {
    const checkVersion = await this.redis.get(`material:version-${editingId}`);
    const version = checkVersion ? Number(checkVersion) : 0;

    if (version !== 0) await this.redis.del(`material:version-${editingId}`);
    await this.redis.set(`material:version-${editingId}`, String(version + 1));

    const contentData = {
      userId: userId,
      timestamp: timestamp,
      content: content,
    };
    await this.redis.set(
      `material:content-${editingId}-${version + 1}`,
      JSON.stringify(contentData),
    );

    const snapshotData = {
      userId: userId,
      timestamp: timestamp,
      snapshot: snapshot,
    };
    await this.redis.set(
      `material:snapshot-${editingId}-${version + 1}`,
      JSON.stringify(snapshotData),
    );
  }

  @Patch('saveHeader/:id')
  async saveHeader(
    @Request() req,
    @Param('id') id: string,
    @Body('header') header: string,
  ) {
    await this.socket.changeHeader(id, header);
    return await this.materialService.setHeader(id, header);
  }

  @Get('getEditors/:editingId')
  async getEditors(@Request() req, @Param('editingId') editingId: string) {
    return await this.materialService.getEditors(editingId);
  }

  @Post('editor/:editingId')
  async addEditor(
    @Request() req,
    @Param('editingId') editingId: string,
    @Body('userId') userId: number,
    @Body('timestamp') timestamp: number,
  ) {
    const editor = await this.materialService.addEditorToMaterial(
      editingId,
      userId,
      timestamp,
    );
    await this.socket.addEditor(editingId, editor);
    return editor;
  }
}
