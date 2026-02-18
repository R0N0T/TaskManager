"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { User, Mail, Lock, Save, Edit2, Loader } from 'lucide-react';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';
import styles from './profile.module.scss';

export default function ProfilePage() {
    const { user, login } = useAuth(); // login used to update local user state
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '' // Assuming backend supports bio
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock API call - in real app, PUT /api/users/me
            // await apiClient.put('/api/users/me', formData);
            
            // Simulating update for now
            setTimeout(() => {
                alert("Profile updated successfully!");
                setIsEditing(false);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setIsLoading(false);
        }
    };

    return (
        <PageContainer>
            <PageHeader 
                title="Your Profile" 
                description="Manage your personal information."
            >
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className={styles.editBtn}
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                )}
            </PageHeader>

            <div className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {formData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.info}>
                            <h2>{formData.username}</h2>
                            <p>{formData.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User size={18} />
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={true} 
                                    className={styles.input}
                                    style={{ cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio</label>
                            <textarea 
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Tell us a bit about yourself..."
                                className={styles.textarea}
                            />
                        </div>

                        {isEditing && (
                            <div className={styles.actions}>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={styles.saveBtn}
                                >
                                    {isLoading ? <Loader className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(false); setFormData({ username: user.username, email: user.email, bio: user.bio }); }}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                
                <div className={styles.securitySection}>
                    <h3>
                        <Lock size={16} /> Security
                    </h3>
                    <p>
                        Want to change your password?
                    </p>
                    <button className={styles.changePasswordBtn}>
                        Change Password
                    </button>
                </div>
            </div>
        </PageContainer>
    );
}
