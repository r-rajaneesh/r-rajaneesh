import { z } from 'zod';

export const SkillSchema = z.object({
  name: z.string(),
  color: z.union([z.string(), z.array(z.string()).length(2)]),
});

export const SkillGroupSchema = z.object({
  category: z.string(),
  items: z.array(SkillSchema),
});

export const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  period: z.string(),
  description: z.string(),
});

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  link: z.string(),
});

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  period: z.string(),
});

export const ConfigSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  status: z.enum(['open_for_work', 'hiring', 'none']),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    github: z.string().url(),
    linkedin: z.string().url(),
    location: z.string(),
  }),
  skills: z.array(SkillGroupSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
});

export type Config = z.infer<typeof ConfigSchema>;
