// sanity/schemaTypes/reviewType.ts
import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const reviewType = defineType({
  name: "review",
  title: "Reviews",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: { type: "product" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userImage",
      title: "User Avatar",
      type: "image",
      options: { hotspot: true },
      description: "صورة شخصية للعميل",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Review Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "helpful",
      title: "Helpful Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "userName",
      subtitle: "comment",
      media: "userImage",
    },
  },
});