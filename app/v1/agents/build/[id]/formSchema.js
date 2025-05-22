import { z } from 'zod';

const baseSchema = z.object({
  aiName: z.string().min(2),
  template: z.string(),
  model: z.string(),
  messageLength: z.number().min(0).optional(),
  allowHumanAgent: z.boolean().optional(),
});

const personalitySchema = z.object({
  primaryTraits: z.array(z.string()).min(1, {
    message: 'Select at least one personality trait',
  }),
  communicationTone: z.string(),
  formalityLevel: z.number(),
  primaryFunction: z.string(),
  brandValues: z.string().optional(),
});

const knowledgeSchema = z.object({
  rules: z.string().min(1, 'Rules are required'),
  companyInformation: z.string().min(1, 'Company information is required'),
});

// Merge all into one schema:
const formSchema = baseSchema.merge(personalitySchema).merge(knowledgeSchema);

export { formSchema };
