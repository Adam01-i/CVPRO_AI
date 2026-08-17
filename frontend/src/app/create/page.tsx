'use client';

import { useEffect, useState } from 'react';
import { CvEditor } from '@/components/cvs/cv-editor';
import { TemplateChooser, type TemplateSelection } from '@/components/cvs/template-chooser/template-chooser';
import { ExperienceQuestionnaire } from '@/components/cvs/template-chooser/experience-questionnaire';
import { RouteLoadingVeil } from '@/components/cvs/template-chooser/route-loading-veil';
import { getStoredExperienceLevel, setStoredExperienceLevel, type ExperienceLevel } from '@/lib/user-profile';

type Step = 'questionnaire' | 'chooser' | 'editor';

export default function PublicCvBuilderPage() {
  const [step, setStep] = useState<Step>('questionnaire');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [selection, setSelection] = useState<TemplateSelection | null>(null);

  useEffect(() => {
    const stored = getStoredExperienceLevel();
    if (stored) {
      setExperienceLevel(stored);
      setStep('chooser');
    }
  }, []);

  const handleQuestionnaireComplete = (level: ExperienceLevel | null) => {
    setExperienceLevel(level);
    if (level) setStoredExperienceLevel(level);
    setStep('chooser');
  };

  const handleUseTemplate = (sel: TemplateSelection) => {
    setSelection(sel);
    setStep('editor');
  };

  return (
    <RouteLoadingVeil key={step}>
      {step === 'questionnaire' ? (
        <ExperienceQuestionnaire onComplete={handleQuestionnaireComplete} />
      ) : step === 'chooser' ? (
        <TemplateChooser experienceLevel={experienceLevel} onUseTemplate={handleUseTemplate} />
      ) : (
        <CvEditor initialTemplate={selection ?? undefined} />
      )}
    </RouteLoadingVeil>
  );
}