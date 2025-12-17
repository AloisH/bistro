-- AlterTable
ALTER TABLE "organization_invites" ADD COLUMN     "invitedById" TEXT;

-- CreateIndex
CREATE INDEX "organization_invites_invitedById_idx" ON "organization_invites"("invitedById");

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
