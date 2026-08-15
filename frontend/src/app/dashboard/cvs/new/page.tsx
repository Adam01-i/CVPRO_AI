'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CvEditor } from '@/components/cvs/cv-editor';
import { TemplateChooser, type TemplateSelection } from '@/components/cvs/template-chooser/template-chooser';

export default function NewCvPage() {
  const [selection, setSelection] = useState<TemplateSelection | null>(null);

  return (
    <ProtectedRoute>
      {selection ? <CvEditor initialTemplate={selection} /> : <TemplateChooser onUseTemplate={setSelection} />}
    </ProtectedRoute>
  );
}