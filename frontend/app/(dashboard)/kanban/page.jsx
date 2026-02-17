import KanbanBoard from "@/app/components/kanban/KanbanBoard";

export default function KanbanPage() {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Kanban Board</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your tasks visually.</p>
                </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <KanbanBoard />
            </div>
        </div>
    );
}

