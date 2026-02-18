import Notes from '../../components/Notes';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';

export default function NotesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Notes" 
        description="Jot down ideas and keep them organized."
      />
      <Notes />
    </PageContainer>
  );
}
