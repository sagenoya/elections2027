import { Module } from '@nestjs/common';
import { ENV, type Env } from '../../config/env.js';
import { PUBLISH_STORAGE, PublishService, createStorage } from './publish.service.js';

@Module({
  providers: [{ provide: PUBLISH_STORAGE, inject: [ENV], useFactory: (env: Env) => createStorage(env) }, PublishService],
  exports: [PublishService],
})
export class PublishModule {}
