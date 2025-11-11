import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BlogEditDialog from "@/components/admin/BlogEditDialog";
import { mapPostToFormData, type AdminPostWithRelations } from "@/lib/admin/blog-form-mapper";

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<AdminPostWithRelations[]> {
  const posts = await db.post.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts as AdminPostWithRelations[];
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const posts = await getPosts();
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.blog' });
  const adminBasePath = `/${params.locale}/admin`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Button asChild>
          <Link href={`${adminBasePath}/blog/new`}>
            <Plus className="w-5 h-5 mr-2" />
            {t('createTitle')}
          </Link>
        </Button>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.post')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.featured')}</TableHead>
              <TableHead>{t('table.publishedAt')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const enTranslation = post.translations.find(t => t.locale === 'en');
                const formData = mapPostToFormData(post);
                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="font-medium">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-muted-foreground">{post.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'default'
                            : post.status === 'draft'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {t(`statusOptions.${post.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.featured ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="w-5 h-5 text-muted-foreground/70" />
                      )}
                    </TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <BlogEditDialog initialData={formData} locale={params.locale} />
                        <button className="text-red-600 hover:text-red-900" aria-label="Delete">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
