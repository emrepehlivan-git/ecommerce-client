'use client';

import { useEffect } from 'react';
import { useScopedI18n } from '@/i18n/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButton from '@/components/auth/login-button';
import { signOut } from '@/lib/auth';

export default function SessionExpiredPage() {
    const t = useScopedI18n('common');

    useEffect(() => {
        signOut({ redirect: false });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="text-center">{t('session.expired_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600 dark:text-gray-300">
                        {t('session.expired_description')}
                    </p>
                </CardContent>
                <CardFooter>
                    <LoginButton />
                </CardFooter>
            </Card>
        </div>
    );
} 