import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { STATES, ELECTION_DATES } from '../src/modules/geo/states.data.js';

/**
 * Idempotent seed: upserts the 37 states and the two 2027 elections.
 * Pass --dry-run to print what would change without writing.
 */
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const url = process.env['DATABASE_URL'];
  if (!url) throw new Error('DATABASE_URL is not set');
  console.log(`Seeding database at host: ${new URL(url).host}${dryRun ? ' (dry run)' : ''}`);

  if (dryRun) {
    console.log(`Would upsert ${STATES.length} states and 2 elections (PRES-2027, GOV-2027).`);
    return;
  }

  const pool = new pg.Pool({ connectionString: url, max: 2 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  try {
    for (const s of STATES) {
      await prisma.state.upsert({
        where: { code: s.code },
        create: s,
        update: { name: s.name, zone: s.zone, hasGovernorshipElection2027: s.hasGovernorshipElection2027 },
      });
    }
    await prisma.election.upsert({
      where: { key: 'PRES-2027' },
      create: { key: 'PRES-2027', type: 'PRESIDENTIAL', year: 2027, date: new Date(ELECTION_DATES.presidential) },
      update: { date: new Date(ELECTION_DATES.presidential) },
    });
    // Governorship: one umbrella record; per-state governorship elections are added in Phase 5.
    await prisma.election.upsert({
      where: { key: 'GOV-2027' },
      create: { key: 'GOV-2027', type: 'GOVERNORSHIP', year: 2027, date: new Date(ELECTION_DATES.governorship) },
      update: { date: new Date(ELECTION_DATES.governorship) },
    });
    const count = await prisma.state.count();
    console.log(`Done. states=${count}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
