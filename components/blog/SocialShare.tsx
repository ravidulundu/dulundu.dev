'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const t = useTranslations('blog');
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://dulundu.dev${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  return (
    <div className="border-y border-border py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{t('share')}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Twitter */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2"
          >
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
          </Button>

          {/* LinkedIn */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2"
          >
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2"
          >
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </Button>

          {/* Copy Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
            aria-label="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                {t('copied')}
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                {t('copyLink')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
