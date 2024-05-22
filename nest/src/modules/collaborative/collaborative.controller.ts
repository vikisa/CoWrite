import {Controller} from "@nestjs/common";
import {CollaborativeService} from './collaborative.service'


@Controller('api/collaborative')
export class CollaborativeController {
  constructor(
    private collaborativeService: CollaborativeService
  ) {}
}





