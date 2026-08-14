'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvEditor } from '@/components/cvs/cv-editor';

export default function CvDetailsPage() {
  const params = useParams<{ id: string }>();

  return (
    <ProtectedRoute>
      <CvEditor cvId={params.id} />
    </ProtectedRoute>
  );
}