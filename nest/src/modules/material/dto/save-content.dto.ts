import { IsString } from 'class-validator';

export class SaveContentDto {
  @IsString()
  editingId: string;

  @IsString()
  userId: string;

  @IsString()
  content: string;

  @IsString()
  snapshot: string;

  @IsString()
  timestamp: string;
}
