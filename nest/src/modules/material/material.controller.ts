import { Controller, Get, Post, Body, Param, Request, Patch } from '@nestjs/common';
import { MaterialService } from './material.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { SocketGateway } from '../socket/socket.gateway';
import { CreateMaterialDto } from './dto/create-material.dto';
import { SaveContentDto } from './dto/save-content.dto';

@Controller('api/material')
export class MaterialController {
  constructor(
    private materialService: MaterialService,
    @InjectRedis() private readonly redis: Redis,
    private readonly socket: SocketGateway,
  ) {}

  @Post('getOrCreate')
  async getOrCreate(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.getOrCreate(createMaterialDto);
  }

  @Get('getList')
  async getMaterials() {
    return this.materialService.getMaterials();
  }

  @Get(':editingId')
  async getMaterialsById(
    @Request() req,
    @Param('editingId') editingId: string,
  ) {
    return this.materialService.getMaterialByEditingId(editingId);
  }

  @Get('checkVersion/:editingId')
  async getLastVersion(@Request() req, @Param('editingId') editingId: string) {
    const version = await this.redis.get(`material:version-${editingId}`);
    let content;
    if (version)
      content = await this.redis.get(
        `material:content-${editingId}-${version}`,
      );

    return { version, content };
  }

  @Post('saveMaterialContent')
  async saveMaterialContent(@Body() saveContentDto: SaveContentDto) {
    const { editingId, userId, timestamp, content, snapshot } = saveContentDto;

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

  @Patch('saveHeader/:editingId')
  async saveHeader(
    @Request() req,
    @Param('editingId') editingId: string,
    @Body('header') header: string,
  ) {
    await this.socket.changeHeader(editingId, header);
    return await this.materialService.setHeader(editingId, header);
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
