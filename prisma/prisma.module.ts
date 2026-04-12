// prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 dùng global cho tiện
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}