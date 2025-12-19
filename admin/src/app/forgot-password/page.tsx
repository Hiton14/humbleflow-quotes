"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset request sent!');
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-slate-600 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <div className="text-center mt-4">
                                <Link href="/admin/login" className="text-sm text-slate-600 hover:text-slate-900">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border border-green-100">
                                If an account exists with that email, a reset link has been generated.
                            </div>
                            <p className="text-sm text-slate-500">
                                Please check your email inbox (and spam folder) for the reset link.
                            </p>
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                <b>Note:</b> Since email service is not configured, the reset link has been logged to the server console.
                            </p>
                            <Link href="/admin/login">
                                <Button variant="outline" className="w-full mt-4">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
