-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('NORTH_CENTRAL', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_SOUTH', 'SOUTH_WEST');

-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('PRESIDENTIAL', 'GOVERNORSHIP', 'SENATE', 'HOUSE', 'STATE_ASSEMBLY');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('NEWS', 'MANUAL', 'POLL', 'DATA');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModelRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "has_governorship_election_2027" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lgas" (
    "id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lgas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parties" (
    "id" UUID NOT NULL,
    "acronym" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ElectionType" NOT NULL,
    "year" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "state_id" UUID,
    "is_off_cycle" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "elections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" UUID NOT NULL,
    "election_id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "running_mate" TEXT,
    "home_state_code" VARCHAR(2),
    "attributes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_results" (
    "id" UUID NOT NULL,
    "election_id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "votes" INTEGER NOT NULL,

    CONSTRAINT "state_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lga_results" (
    "id" UUID NOT NULL,
    "election_id" UUID NOT NULL,
    "lga_id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "votes" INTEGER NOT NULL,

    CONSTRAINT "lga_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_turnout" (
    "id" UUID NOT NULL,
    "election_id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "registered" INTEGER,
    "accredited" INTEGER,
    "valid_votes" INTEGER,
    "rejected" INTEGER,
    "total_cast" INTEGER,

    CONSTRAINT "state_turnout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lga_turnout" (
    "id" UUID NOT NULL,
    "election_id" UUID NOT NULL,
    "lga_id" UUID NOT NULL,
    "registered" INTEGER,
    "accredited" INTEGER,
    "valid_votes" INTEGER,
    "rejected" INTEGER,
    "total_cast" INTEGER,

    CONSTRAINT "lga_turnout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "area_key" TEXT NOT NULL,
    "state_id" UUID,
    "lga_id" UUID,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_ingest" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_ingest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "source" "EventSource" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "external_id" TEXT,
    "state_id" UUID,
    "payload" JSONB NOT NULL,
    "effect" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_runs" (
    "id" UUID NOT NULL,
    "status" "ModelRunStatus" NOT NULL DEFAULT 'RUNNING',
    "model_version" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "simulations" INTEGER NOT NULL DEFAULT 0,
    "snapshot_version" TEXT,
    "snapshot" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "model_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_code_key" ON "states"("code");

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lgas_state_id_name_key" ON "lgas"("state_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "parties_acronym_key" ON "parties"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "elections_key_key" ON "elections"("key");

-- CreateIndex
CREATE INDEX "elections_type_year_idx" ON "elections"("type", "year");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_election_id_party_id_key" ON "candidates"("election_id", "party_id");

-- CreateIndex
CREATE UNIQUE INDEX "state_results_election_id_state_id_party_id_key" ON "state_results"("election_id", "state_id", "party_id");

-- CreateIndex
CREATE UNIQUE INDEX "lga_results_election_id_lga_id_party_id_key" ON "lga_results"("election_id", "lga_id", "party_id");

-- CreateIndex
CREATE UNIQUE INDEX "state_turnout_election_id_state_id_key" ON "state_turnout"("election_id", "state_id");

-- CreateIndex
CREATE UNIQUE INDEX "lga_turnout_election_id_lga_id_key" ON "lga_turnout"("election_id", "lga_id");

-- CreateIndex
CREATE INDEX "indicators_key_period_idx" ON "indicators"("key", "period");

-- CreateIndex
CREATE UNIQUE INDEX "indicators_source_key_period_area_key_key" ON "indicators"("source", "key", "period", "area_key");

-- CreateIndex
CREATE INDEX "raw_ingest_source_fetched_at_idx" ON "raw_ingest"("source", "fetched_at");

-- CreateIndex
CREATE UNIQUE INDEX "raw_ingest_source_external_id_key" ON "raw_ingest"("source", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_external_id_key" ON "events"("external_id");

-- CreateIndex
CREATE INDEX "events_status_created_at_idx" ON "events"("status", "created_at");

-- CreateIndex
CREATE INDEX "events_occurred_at_idx" ON "events"("occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "model_runs_snapshot_version_key" ON "model_runs"("snapshot_version");

-- CreateIndex
CREATE INDEX "model_runs_status_started_at_idx" ON "model_runs"("status", "started_at");

-- AddForeignKey
ALTER TABLE "lgas" ADD CONSTRAINT "lgas_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elections" ADD CONSTRAINT "elections_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_results" ADD CONSTRAINT "state_results_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_results" ADD CONSTRAINT "state_results_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_results" ADD CONSTRAINT "state_results_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lga_results" ADD CONSTRAINT "lga_results_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lga_results" ADD CONSTRAINT "lga_results_lga_id_fkey" FOREIGN KEY ("lga_id") REFERENCES "lgas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lga_results" ADD CONSTRAINT "lga_results_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_turnout" ADD CONSTRAINT "state_turnout_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_turnout" ADD CONSTRAINT "state_turnout_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lga_turnout" ADD CONSTRAINT "lga_turnout_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lga_turnout" ADD CONSTRAINT "lga_turnout_lga_id_fkey" FOREIGN KEY ("lga_id") REFERENCES "lgas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_lga_id_fkey" FOREIGN KEY ("lga_id") REFERENCES "lgas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;
