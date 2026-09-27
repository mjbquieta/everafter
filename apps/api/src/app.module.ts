import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WeddingsModule } from './modules/weddings/weddings.module';
import { GuestsModule } from './modules/guests/guests.module';
import { BudgetModule } from './modules/budget/budget.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PlannersModule } from './modules/planners/planners.module';
import { WebsiteSettingsModule } from './modules/website-settings/website-settings.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 900000,
        limit: 60,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    WeddingsModule,
    GuestsModule,
    BudgetModule,
    ChecklistModule,
    GalleryModule,
    NotificationsModule,
    PlannersModule,
    WebsiteSettingsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
