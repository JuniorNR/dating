import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AnnouncementCreateDto } from './announcement.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    return this.prisma.announcement.findMany();
  }

  create(dto: AnnouncementCreateDto) {
    return this.prisma.announcement.create({
      data: dto,
    });
  }
}
