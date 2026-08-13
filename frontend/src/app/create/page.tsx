'use client';

import { AppShell } from '@/components/layout/app-shell';
import { CvEditor } from '@/components/cvs/cv-editor';

export default function PublicCvBuilderPage() {
  return (
    <AppShell>
      <CvEditor />
    </AppShell>
  );
}
