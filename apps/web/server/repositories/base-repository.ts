import type { PrismaClient } from '../../prisma/generated/client'
import { db } from '../utils/db'

/**
 * Base repository class
 * Provides db singleton access
 */
export abstract class BaseRepository {
  protected readonly db: PrismaClient

  constructor() {
    this.db = db
  }
}
