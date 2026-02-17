"use client";
import React from 'react';

export default function ProfilePage() {
    return (
        <div className="page-container" style={{ paddingTop: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Your Profile</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your personal workspace and settings.</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-default)' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Profile editing features coming soon...</p>
            </div>
        </div>
    );
}
