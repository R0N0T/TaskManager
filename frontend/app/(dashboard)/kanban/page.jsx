import KanbanBoard from "@/app/components/kanban/KanbanBoard";
import PageContainer from "@/app/components/layout/PageContainer";
import PageHeader from "@/app/components/layout/PageHeader";

export default function KanbanPage() {
    return (
        <PageContainer style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <PageHeader 
                title="Kanban Board" 
                description="Manage your tasks visually."
            />
            <div style={{ flex: 1, minHeight: 0 }}>
                <KanbanBoard />
            </div>
        </PageContainer>
    );
}

