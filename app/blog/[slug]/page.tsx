import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductImage from "@/components/ProductImage";
import { blogPosts, getAllBlogSlugs, getBlogPost } from "@/data/blog";
import { getProductBySlug } from "@/data/products";
import { labelCaps, pageShell } from "@/lib/layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  const url = `https://www.miskahealth.in/blog/${slug}`;
  const imageUrl = `https://www.miskahealth.in${post.image}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: imageUrl, width: 2000, height: 2000, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = post.relatedProductSlug ? getProductBySlug(post.relatedProductSlug) : undefined;
  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: `https://www.miskahealth.in${post.image}`,
    author: { "@type": "Organization", name: "MISKA Hair & Skin Science" },
    publisher: {
      "@type": "Organization",
      name: "MISKA Hair & Skin Science",
      url: "https://www.miskahealth.in",
    },
    mainEntityOfPage: `https://www.miskahealth.in/blog/${slug}`,
  };

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />

      <article className={`${pageShell} pt-28 sm:pt-32 pb-20 sm:pb-28`}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[#888] hover:text-[#0A0A0A] mb-10"
        >
          <ArrowLeft size={12} />
          Journal
        </Link>

        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>{post.category}</p>
        <h1 className="font-serif text-[32px] sm:text-[44px] md:text-[48px] font-light leading-[1.1] text-[#0A0A0A] max-w-3xl mb-6">
          {post.title}
        </h1>
        <p className="text-[12px] text-[#AAA] mb-10">
          {formatDate(post.date)} · {post.readTime} read
        </p>

        <div className="relative aspect-[16/9] max-h-[480px] border border-[#E5E2DB] bg-[#FDFCFA] mb-14 sm:mb-16">
          <ProductImage
            src={post.image}
            alt=""
            priority
            sizes="(max-width: 768px) 100vw, 960px"
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-2xl space-y-10">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-serif text-[22px] sm:text-[26px] font-light text-[#0A0A0A] mb-4">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((para, j) => (
                <p key={j} className="text-[15px] sm:text-[16px] text-[#555] leading-[1.95] font-light mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        {related && (
          <div className="mt-16 pt-12 shop-divider max-w-2xl">
            <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>Related product</p>
            <Link
              href={`/products/${related.slug}`}
              className="group flex gap-6 items-center"
            >
              <div className="relative w-20 h-20 shrink-0 border border-[#E5E2DB] bg-[#FDFCFA]">
                <ProductImage
                  src={related.images.main}
                  alt={related.name}
                  sizes="80px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="font-serif text-[18px] text-[#0A0A0A] group-hover:text-[#1C3A2A] transition-colors">
                  {related.name}
                </p>
                <p className="text-[12px] text-[#888] font-light mt-1">{related.tagline}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-[#1C3A2A] shrink-0" />
            </Link>
          </div>
        )}
      </article>

      {otherPosts.length > 0 && (
        <section className="shop-divider bg-white/40">
          <div className={`${pageShell} py-16 sm:py-20`}>
            <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-8`}>More from the journal</p>
            <ul className="grid sm:grid-cols-2 gap-10">
              {otherPosts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <h3 className="font-serif text-[20px] text-[#0A0A0A] mb-2 group-hover:text-[#1C3A2A] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[13px] text-[#888] font-light line-clamp-2">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
