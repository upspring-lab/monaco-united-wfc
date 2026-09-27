import * as migration_20260927_170333_initial from './20260927_170333_initial';
import * as migration_20260927_202225_sync_and_s3 from './20260927_202225_sync_and_s3';

export const migrations = [
  {
    up: migration_20260927_170333_initial.up,
    down: migration_20260927_170333_initial.down,
    name: '20260927_170333_initial',
  },
  {
    up: migration_20260927_202225_sync_and_s3.up,
    down: migration_20260927_202225_sync_and_s3.down,
    name: '20260927_202225_sync_and_s3'
  },
];
