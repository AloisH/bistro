import { validateEnv, OPTIONAL_VAR_GROUPS } from '#shared/env';

export default defineNitroPlugin((_nitroApp) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const result = validateEnv(process.env, isProduction);

  // Fail fast on required var errors
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([field, msgs]) => `  - ${field}: ${msgs?.join(', ')}`)
      .join('\n');

    console.error('\n❌ Environment validation failed:\n');
    console.error(errorMessages);
    console.error('\nServer cannot start. Check .env file.\n');

    throw new Error('Invalid environment configuration');
  }

  // Log optional var status (without values)
  const missingOptionalVars: string[] = [];
  const enabledOptionalVars: string[] = [];

  Object.entries(OPTIONAL_VAR_GROUPS).forEach(([group, vars]) => {
    const missing = vars.filter(v => !process.env[v]);
    const present = vars.filter(v => process.env[v]);

    if (missing.length === vars.length) {
      // All missing - feature disabled
      missingOptionalVars.push(`${group}: ${missing.join(', ')}`);
    } else if (missing.length > 0) {
      // Partial - some present, some missing
      missingOptionalVars.push(`${group} (partial): ${missing.join(', ')}`);
      enabledOptionalVars.push(`${group} (partial): ${present.join(', ')}`);
    } else {
      // All present - feature enabled
      enabledOptionalVars.push(`${group}: ${present.join(', ')}`);
    }
  });

  console.log('✅ Environment validation passed');

  if (enabledOptionalVars.length > 0) {
    console.log('\n✓ Optional features enabled:\n');
    enabledOptionalVars.forEach(msg => console.log(`  - ${msg}`));
  }

  if (missingOptionalVars.length > 0) {
    console.warn('\n⚠️  Optional features disabled (missing env vars):\n');
    missingOptionalVars.forEach(msg => console.warn(`  - ${msg}`));
    console.warn('');
  }
});
