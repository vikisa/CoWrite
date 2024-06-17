import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMaterialDto {
  @IsNumber()
  @IsNotEmpty()
  createDate: number;

  @IsNumber()
  saveDate: number;

  @IsString()
  text: string;

  @IsString()
  header: string;

  @IsNumber()
  @IsNotEmpty()
  creatorId: number;

  @IsString()
  @IsNotEmpty()
  editingId: string;
}
