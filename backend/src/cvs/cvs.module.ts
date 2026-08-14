import { Module } from '@nestjs/common';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module'; // ajouté

@Module({
  imports: [AuthModule, StorageModule],
  controllers: [CvsController],
  providers: [CvsService],
})
export class CvsModule {}
