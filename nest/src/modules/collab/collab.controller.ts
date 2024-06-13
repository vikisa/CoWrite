import {Controller} from "@nestjs/common";
import {CollabService} from './collab.service'

@Controller('api/collaborative')
export class CollabController {
  constructor(
    private collaborativeService: CollabService
  ) {}
}





