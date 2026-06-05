
import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(4).warning("Maximum 4 images recommended"),
      description: "أضف 3-4 صور للمنتج (الحد الأقصى 4 صور)",
    }),
    defineField({
      name: "video",
      title: "Product Video (MP4)",
      type: "file",
      options: {
        accept: "video/mp4",
      },
      description: "ارفع فيديو MP4 للمنتج (حجم مناسب)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price (before discount)",
      type: "number",
      description: "السعر الأصلي للمنتج (سيظهر مشطوباً بجانب سعر الخصم)",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),



    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    
defineField({
  name: "isNew",
  title: "New Collection",
  type: "boolean",
  description: "تحديد إذا كان المنتج ضمن التشكيلة الجديدة",
  initialValue: false,
}),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Shoulder Bag", value: "shoulder-bag" },
          { title: "Crossbody", value: "crossbody" },
          { title: "Clutch", value: "clutch" },
          { title: "Tote", value: "tote" },
          { title: "Backpack", value: "backpack" },
          { title: "Others", value: "others" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `MAD${subtitle}`,
        media: image,
      };
    },
  },
});