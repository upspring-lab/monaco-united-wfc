import * as migration_20260927_170333_initial from './20260927_170333_initial';

export const migrations = [
  {
    up: migration_20260927_170333_initial.up,
    down: migration_20260927_170333_initial.down,
    name: '20260927_170333_initial'
  },
];
