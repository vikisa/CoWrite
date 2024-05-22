import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import {Not, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Materials } from "../../entities/Materials.entity";

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Materials)
    private readonly materialRepository: Repository<Materials>,
  ) {}

  createMaterial(data: any): Promise<Materials>{
    return this.materialRepository.save(data)
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
    const materials = await this.materialRepository.find();
    if (!materials) throw new NotFoundException('Материалы не найдены');

    return materials;
  }
}
