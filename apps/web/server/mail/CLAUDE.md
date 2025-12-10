# server/mail

Email templates (Vue Email) + Resend integration.

## Overview

**Stack:**
- Vue Email (@vue-email/components, @vue-email/render)
- Resend client (server/mail/resend.ts)
- Templates in server/mail/template/

## Creating Templates

**Location:** `server/mail/template/`

**Pattern:**

```vue
<!-- server/mail/template/WelcomeEmail.vue -->
<script setup lang="ts">
import { EButton, EHtml, EText, ESection, EContainer } from '@vue-email/components'

interface Props {
  name: string
  loginUrl: string
}

defineProps<Props>()
</script>

<template>
  <EHtml lang="en">
    <ESection>
      <EContainer>
        <EText>Hi {{ name }},</EText>
        <EText>Welcome to Bistro!</EText>
        <EButton :href="loginUrl">
          Get Started
        </EButton>
      </EContainer>
    </ESection>
  </EHtml>
</template>
```

**TypeScript template:**

```typescript
// server/mail/template/welcome.ts
import { render } from '@vue-email/render'
import { defineComponent, h } from 'vue'
import { EButton, EHtml, EText } from '@vue-email/components'

export const welcome = (name: string, url: string) => {
  const template = defineComponent({
    setup() {
      return () => h(EHtml, { lang: 'en' }, [
        h(EText, `Hi ${name}`),
        h(EButton, { href: url }, 'Get Started')
      ])
    }
  })

  return render(template)
}
```

## Sending Emails

**Recommended: Use EmailService (handles templates + validation):**

```typescript
import { emailService } from '~/server/services/email-service'
import WelcomeEmail from '~/server/mail/template/WelcomeEmail.vue'

// Send with template
const result = await emailService.sendTemplateEmail({
  to: user.email,
  subject: 'Welcome to Bistro',
  template: WelcomeEmail,
  props: {
    name: user.name,
    loginUrl: 'https://app.example.com/login'
  }
})

// Returns null if RESEND_API_KEY not configured (dev mode)
if (!result) {
  console.warn('Email not sent - service not configured')
}
```

**Low-level: Direct resend client usage:**

```typescript
import { resend } from '~/server/mail/resend'
import { render } from '@vue-email/render'
import WelcomeEmail from '~/server/mail/template/WelcomeEmail.vue'

// Render template
const html = await render(WelcomeEmail, {
  name: 'John',
  loginUrl: 'https://app.example.com/login'
})

// Send via Resend
if (resend) {
  await resend.emails.send({
    from: 'noreply@example.com',
    to: user.email,
    subject: 'Welcome to Bistro',
    html
  })
}
```

**Render options:**

```typescript
// Pretty print (dev)
const html = await render(Template, props, { pretty: true })

// Plain text version
const text = await render(Template, props, { plainText: true })
```

## Available Components

From `@vue-email/components`:

- `EHtml` - Root wrapper (lang, dir)
- `EHead` - Meta tags
- `EContainer` - Max-width wrapper
- `ESection` - Layout section
- `ERow`, `EColumn` - Grid layout
- `EText` - Paragraph/heading
- `EButton` - CTA button
- `ELink` - Hyperlink
- `EImg` - Image
- `EHr` - Horizontal rule
- `EPreview` - Preview text (inbox)

## Common Patterns

**Transactional emails:**

```typescript
// server/api/auth/verify-email.post.ts
export default defineEventHandler(async (event) => {
  const { email, token } = await readBody(event)

  const verifyUrl = `${process.env.APP_URL}/auth/verify?token=${token}`

  const html = await render(VerifyEmail, { verifyUrl })

  await resend.emails.send({
    from: 'noreply@bistro.app',
    to: email,
    subject: 'Verify your email',
    html
  })
})
```

**Batch emails:**

```typescript
await resend.batch.send([
  { from: '...', to: 'user1@...', subject: '...', html: html1 },
  { from: '...', to: 'user2@...', subject: '...', html: html2 }
])
```

**With attachments:**

```typescript
await resend.emails.send({
  from: 'noreply@bistro.app',
  to: user.email,
  subject: 'Invoice',
  html,
  attachments: [
    {
      filename: 'invoice.pdf',
      content: Buffer.from(pdfData)
    }
  ]
})
```

## Environment

**Required in .env:**

```bash
NUXT_RESEND_API_KEY=re_xxx  # From resend.com/api-keys
```

**Testing:**
- Use test API keys in dev (starts with `re_test_`)
- Emails sent to test mode visible in Resend dashboard
- No actual delivery in test mode

## File Naming

- Components: PascalCase (`WelcomeEmail.vue`)
- Functions: camelCase (`welcome.ts`)
- Place in `server/mail/template/`

## Styling

**Inline styles (required for email):**

```vue
<EText :style="{ color: '#333', fontSize: '16px' }">
  Content
</EText>
```

**Tailwind not supported** - Email clients require inline styles.

**Use EButton props:**

```vue
<EButton
  href="https://..."
  :style="{
    backgroundColor: '#000',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '6px'
  }"
>
  Click here
</EButton>
```

## Testing Templates

**Create preview API route:**

```typescript
// server/api/mail/preview/[template].get.ts
import { render } from '@vue-email/render'

export default defineEventHandler(async (event) => {
  const template = getRouterParam(event, 'template')

  // Dynamic import
  const Template = await import(`~/server/mail/template/${template}.vue`)

  const html = await render(Template.default, {
    // Mock props
    name: 'Test User',
    loginUrl: 'https://example.com'
  }, { pretty: true })

  return html
})
```

**Access:** `http://localhost:3000/api/mail/preview/WelcomeEmail`

## Error Handling

```typescript
try {
  const result = await resend.emails.send({ ... })
  console.log('Email sent:', result.data?.id)
} catch (error) {
  console.error('Resend error:', error)
  throw createError({
    statusCode: 500,
    message: 'Failed to send email'
  })
}
```

## Best Practices

- ✅ Server-only - Never import resend in client code
- ✅ Use preview text - Add `<EPreview>` for inbox preview
- ✅ Plain text version - Provide for accessibility
- ✅ Inline styles - Required for email client compatibility
- ✅ Test thoroughly - Preview in multiple clients
- ❌ No Tailwind classes - Won't work in emails
- ❌ No external CSS - Inline only
- ❌ No JavaScript - Email clients strip it

## Common Emails

**Suggested templates:**

1. `WelcomeEmail.vue` - Post-signup
2. `VerifyEmail.vue` - Email verification
3. `ResetPassword.vue` - Password reset link
4. `ReceiptEmail.vue` - Payment confirmation
5. `InviteEmail.vue` - Team/project invite

## Resources

- [Vue Email Docs](https://vuemail.net/getting-started/usage)
- [Resend Docs](https://resend.com/docs/introduction)
- [Email Components](https://vuemail.net/components/button)
