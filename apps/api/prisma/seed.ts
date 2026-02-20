import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Dynamic import of frontend problem data
async function loadProblems() {
  // We use tsx to run this, so we can import TypeScript directly
  const { problems } = await import(path.resolve(__dirname, '../../src/data/problems.ts'))
  return problems
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-')
}

const prisma = new PrismaClient()

async function main() {
  const problems = await loadProblems()

  console.log(`Seeding ${problems.length} problems...`)

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { id: problem.id },
      update: {
        title: problem.title,
        slug: slugify(problem.title),
        difficulty: problem.difficulty,
        categories: problem.categories,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        testCases: problem.testCases,
        starterCode: problem.starterCode,
        hints: problem.hints || [],
      },
      create: {
        id: problem.id,
        title: problem.title,
        slug: slugify(problem.title),
        difficulty: problem.difficulty,
        categories: problem.categories,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        testCases: problem.testCases,
        starterCode: problem.starterCode,
        hints: problem.hints || [],
      },
    })
  }

  console.log(`Seeded ${problems.length} problems successfully.`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
