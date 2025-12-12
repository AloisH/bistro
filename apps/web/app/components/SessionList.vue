<template>
  <div class="space-y-4">
    <div
      v-if="sessions.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <UIcon
        name="i-lucide-shield-off"
        class="mx-auto mb-3 text-4xl"
      />
      <p>No active sessions found</p>
    </div>

    <div
      v-for="session in sessions"
      :key="session.id"
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 flex-1">
          <UIcon
            :name="getDeviceIcon(session.device)"
            class="text-2xl text-gray-400 dark:text-gray-500 mt-1"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ session.browser }} on {{ session.os }}
              </h3>
              <UBadge
                v-if="session.isCurrent"
                color="primary"
                variant="subtle"
              >
                Current Session
              </UBadge>
            </div>
            <div class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p v-if="session.ipAddress">
                <UIcon
                  name="i-lucide-map-pin"
                  class="inline mr-1"
                />
                {{ session.ipAddress }}
              </p>
              <p>
                <UIcon
                  name="i-lucide-clock"
                  class="inline mr-1"
                />
                Last active: {{ formatTime(session.lastActive) }}
              </p>
            </div>
          </div>
        </div>
        <UButton
          v-if="!session.isCurrent"
          color="error"
          variant="outline"
          size="sm"
          :loading="loading"
          @click="$emit('revoke', session.id)"
        >
          Revoke
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SessionWithMetadata {
  id: string;
  isCurrent: boolean;
  browser: string;
  os: string;
  device: string;
  ipAddress: string | null;
  createdAt: Date;
  lastActive: Date;
}

interface Props {
  sessions: SessionWithMetadata[];
  loading?: boolean;
}

defineProps<Props>();

defineEmits<{
  revoke: [id: string];
}>();

function getDeviceIcon(device: string): string {
  if (device === 'Mobile') return 'i-lucide-smartphone';
  if (device === 'Tablet') return 'i-lucide-tablet';
  return 'i-lucide-monitor';
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(date).toLocaleDateString();
}
</script>
