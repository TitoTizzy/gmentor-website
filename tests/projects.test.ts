import { describe, expect, it } from 'vitest';
import { projects, publishedProjects } from '../src/data/projects';

describe('project publication rules', () => {
  it('keeps Forest Street unpublished', () => {
    expect(projects.find((project) => project.slug === 'forest-street')?.status).toBe('draft');
  });

  it('never exposes draft projects in the public list', () => {
    expect(publishedProjects.every((project) => project.status === 'published')).toBe(true);
  });

  it('does not invent years, roles or credits', () => {
    expect(projects.every((project) => project.year === null && project.role === null && project.credits === null)).toBe(true);
  });
});
