import { Suspense } from 'react';
import { LoginView } from '@/views/login';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
