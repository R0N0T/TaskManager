"use client";
import Pomodoro from '../../components/Pomodoro';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';

export default function PomodoroPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Focus Timer" 
        description="Use the Pomodoro technique to boost productivity."
      />
      <Pomodoro />
    </PageContainer>
  );
}