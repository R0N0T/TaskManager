import React from 'react';

export default function PageHeader({ title, description, children }) {
  return (
    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', letterSpacing: '-0.025em', color: 'hsl(var(--foreground))' }}>
          {title}
        </h1>
        {description && (
          <p style={{ marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
            {description}
          </p>
        )}
      </div>
      {children && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}
