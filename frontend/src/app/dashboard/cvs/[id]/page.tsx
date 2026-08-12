'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvEditor } from '@/components/cvs/cv-editor';

export default function CvDetailsPage() {
  const params = useParams<{ id: string }>();

  return (
    <ProtectedRoute>
      <AppShell>
        <CvEditor cvId={params.id} />
      </AppShell>
    </ProtectedRoute>
  );
}
