import { client } from "@/config/contentful/contentful";
import {
  CategorySkeleton,
  ContentType,
  ServiceSkeleton,
} from "@/config/contentful/types";

export const getCategoriesFromContentful = async (locale: string) => {
  const response = await client.getEntries<CategorySkeleton>({
    content_type: ContentType.Category,
    locale,
  });

  return response.items;
};

export const getServicesFromContentful = async ({
  locale,
  baseSlug,
  slug,
}: {
  locale: string;
  baseSlug?: string;
  slug?: string;
}) => {
  const response = await client.getEntries<ServiceSkeleton>({
    content_type: ContentType.Service,
    locale,
    include: 2,
    ...(baseSlug && {
      // ✅ REQUIRED: tell Contentful what the reference type is
      "fields.baseCategory.sys.contentType.sys.id": ContentType.Category,

      // ✅ actual filter
      "fields.baseCategory.fields.slug": baseSlug,
    }),
    ...(slug && {
      "fields.slug": slug,
    }),
  });
  return response.items;
};
