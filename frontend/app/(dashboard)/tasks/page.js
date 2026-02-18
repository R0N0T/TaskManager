"use client";
import TaskManager from '../../components/TaskManager';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';

export default function TasksPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Tasks & Habits" 
        description="Track your daily progress and long-term goals."
      />
      <TaskManager />
    </PageContainer>
  );
}