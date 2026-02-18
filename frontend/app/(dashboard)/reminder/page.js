"use client";
import Reminder from '../../components/Reminder';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';

export default function ReminderPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Reminders" 
        description="Stay on top of your schedule."
      />
      <Reminder />
    </PageContainer>
  );
}