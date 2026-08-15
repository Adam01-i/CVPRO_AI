'use client';

import { useState } from 'react';
import { CvEditor } from '@/components/cvs/cv-editor';
import { TemplateChooser, type TemplateSelection } from '@/components/cvs/template-chooser/template-chooser';

export default function PublicCvBuilderPage() {
  const [selection, setSelection] = useState<TemplateSelection | null>(null);

  if (!selection) {
    return <TemplateChooser onUseTemplate={setSelection} />;
  }

  return <CvEditor initialTemplate={selection} />;
}