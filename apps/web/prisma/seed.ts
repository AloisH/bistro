import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { PrismaClient } from './generated/client'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@bistro.dev' },
    update: {},
    create: {
      email: 'demo@bistro.dev',
      name: 'Demo User',
    },
  })

  console.log(`✓ Created user: ${user.email}`)

  // Create sample project
  const project = await prisma.project.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: 'demo-project',
      },
    },
    update: {},
    create: {
      title: 'Demo Project',
      description: 'A sample project for testing',
      slug: 'demo-project',
      status: 'active',
      userId: user.id,
    },
  })

  console.log(`✓ Created project: ${project.title}`)

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
