'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyCvsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/cvs');
  }, [router]);

  return null;
}