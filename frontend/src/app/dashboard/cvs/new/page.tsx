'use client';

import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvEditor } from '@/components/cvs/cv-editor';

export default function NewCvPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <CvEditor />
      </AppShell>
    </ProtectedRoute>
  );
}
