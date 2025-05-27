'use client';

import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Copy, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const platforms = [
  {
    name: 'Custom Website',
    logo: '/logos/html.png',
    instructions: 'Open your HTML file and paste the script just before the </body> tag.',
  },
  {
    name: 'WordPress',
    logo: '/logos/wordpress.png',
    instructions:
      'Go to Appearance > Theme File Editor > footer.php and paste the script before </body>.',
  },
  {
    name: 'Shopify',
    logo: '/logos/shopify.png',
    instructions:
      'Go to Online Store > Themes > Edit Code > layout/theme.liquid and paste the script before </body>.',
    comingSoon: true,
  },
  {
    name: 'Webflow',
    logo: '/logos/webflow.png',
    instructions: 'Go to Project Settings > Custom Code > Footer and paste the script there.',
    comingSoon: true,
  },
  {
    name: 'Next.js',
    logo: '/logos/next.js.png',
    instructions:
      'Use the <Script> component from next/script in _app.js or _document.js with strategy="afterInteractive".',
    comingSoon: true,
  },

  {
    name: 'Wix',
    logo: '/logos/wix.png',
    instructions:
      'Go to Settings > Custom Code > Paste the script in Footer and set it to load on all pages.',
    comingSoon: true,
  },
];

interface IntegrationPlatformCardsProps {
  script: string;
}

export function IntegrationPlatformCards({ script }: IntegrationPlatformCardsProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const copyToClipboard = async (platform: string) => {
    try {
      await navigator.clipboard.writeText(script);
      setCopiedPlatform(platform);
      toast.success(`✅ Script copied for ${platform}`);
    } catch {
      toast.error('❌ Failed to copy script');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 px-3 lg:px-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {platforms.map(platform => {
        const isComingSoon = platform.comingSoon;

        return (
          <Dialog key={platform.name}>
            <DialogTrigger asChild disabled={isComingSoon}>
              <Card
                className={`relative flex cursor-pointer flex-col items-center justify-between gap-4 space-y-2 p-5 transition-transform ${isComingSoon ? 'pointer-events-none opacity-50' : 'bg-accent hover:scale-105'} `}
              >
                {isComingSoon && (
                  <span className="absolute top-2 right-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-black shadow-sm">
                    Coming Soon
                  </span>
                )}

                <Image
                  src={platform.logo}
                  alt={platform.name}
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] rounded-md object-contain"
                />
                <p className="text-xl font-medium text-white">{platform.name}</p>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isComingSoon}
                  className="bg-primary hover:bg-primary/50 mt-auto flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isComingSoon ? 'Soon' : 'Connect'} <Link2 className="h-4 w-4" />
                </Button>
              </Card>
            </DialogTrigger>

            {!isComingSoon && (
              <DialogContent className="w-full !max-w-md">
                <DialogHeader>
                  <DialogTitle>{platform.name} Installation</DialogTitle>
                  <DialogDescription>{platform.instructions}</DialogDescription>
                </DialogHeader>
                <pre className="bg-muted my-4 rounded-md p-3 text-xs break-words whitespace-pre-wrap">
                  {script}
                </pre>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(platform.name)}>
                  <Copy className="mr-1 h-4 w-4" />
                  {copiedPlatform === platform.name ? 'Copied' : 'Copy Code'}
                </Button>
              </DialogContent>
            )}
          </Dialog>
        );
      })}
    </div>
  );
}
