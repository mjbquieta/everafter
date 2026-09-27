import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { HealthCheckResponse } from '@everafter/types';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthCheckResponse> {
    let databaseStatus = 'healthy';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      databaseStatus = 'unhealthy';
    }

    return {
      status: databaseStatus === 'healthy' ? 'ok' : 'degraded',
      database: databaseStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
