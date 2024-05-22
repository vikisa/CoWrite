import {Module} from "@nestjs/common";
import {CollaborativeService} from "./collaborative.service";
import {CollaborativeController} from "./collaborative.controller";

@Module({
  controllers: [CollaborativeController],
  providers: [CollaborativeService],
  exports: [CollaborativeService]
})
export class CollaborativeModule {}