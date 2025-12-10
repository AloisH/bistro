import { z } from 'zod';

export const emailAddressSchema = z.preprocess(
  val => (typeof val === 'string' ? val.trim().toLowerCase() : val),
  z.string().email('Invalid email'),
);

export const sendEmailSchema = z.object({
  to: z.union([emailAddressSchema, z.array(emailAddressSchema)]),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
  text: z.string().optional(),
  from: emailAddressSchema.optional(),
  replyTo: emailAddressSchema.optional(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
