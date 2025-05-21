/* eslint-disable @next/next/no-img-element */
'use client';
import AnimatedInputBar from '@/components/AnimatedInput';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <img src="/logo.png" alt="" className="w-6" />
            </div>
            Coucou Ai.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden w-full lg:block">
        <img
          src="/image.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative flex h-full w-full items-center justify-center">
          <AnimatedInputBar />
        </div>
      </div>
    </div>
  );
}
