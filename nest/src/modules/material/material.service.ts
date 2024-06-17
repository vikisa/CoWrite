import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Materials } from '../../entities/Materials.entity';
import { UsersToMaterials } from '../../entities/UsersToMaterials.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Materials)
    private readonly materialRepository: Repository<Materials>,
    @InjectRepository(UsersToMaterials)
    private readonly usersToMaterialsRepository: Repository<UsersToMaterials>,
  ) {}

  createMaterial(data: any) {
    return this.materialRepository.save(data);
  }

  async getOrCreate(data) {
    try {
      return {
        material: await this.getMaterialByEditing(data.editingId),
        message: 'Материал открыт',
      };
    } catch (e) {
      await this.createMaterial(data);
      return {
        material: await this.getMaterialByEditing(data.editingId),
        message: 'Материал создан',
      };
    }
  }

  async getMaterialByEditing(id) {
    const materialId: string = id;
    const material = await this.materialRepository.findOne({
      where: [
        {
          editingId: materialId,
        },
      ],
    });

    if (!material) throw new NotFoundException('material not found');

    return material;
  }

  async getMaterials() {
    const materials = await this.materialRepository.find({
      order: { createDate: 'DESC' },
      relations: ['creator'],
    });
    if (!materials) throw new NotFoundException('Материалы не найдены');

    return materials;
  }

  async setHeader(editingId, header) {
    const material = await this.materialRepository.findOne({
      where: [
        {
          editingId: editingId,
        },
      ],
    });
    const id = material.id;
    delete material.id;
    material.header = header;

    await this.materialRepository.update(id, material);
  }

  async getEditors(editingId) {
    const material = await this.materialRepository.findOne({
      select: ['id'],
      where: [
        {
          editingId: editingId,
        },
      ],
    });
    if (!material) return [];

    const id = material.id;
    return await this.usersToMaterialsRepository.find({
      where: [
        {
          materialId: id,
        },
      ],
      relations: ['user'],
    });
  }

  async addEditorToMaterial(editingId, userId, timestamp) {
    const material = await this.materialRepository.findOne({
      select: ['id'],
      where: [
        {
          editingId: editingId,
        },
      ],
    });
    if (!material) return;
    const materialId = material.id;

    const { id } = await this.usersToMaterialsRepository.save({
      userId,
      materialId: materialId,
      date: timestamp,
    });

    return await this.usersToMaterialsRepository.findOne({
      where: [
        {
          id: id,
        },
      ],
      relations: ['user'],
    });
  }
}
