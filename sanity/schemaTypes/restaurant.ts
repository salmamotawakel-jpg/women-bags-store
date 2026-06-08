// sanity/schemaTypes/restaurant.ts
import { VideoIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const restaurantType = defineType({
  name: "restaurant",
  title: "Restaurant",
  type: "document",
  icon: VideoIcon,
  fields: [
    defineField({
      name: "video",
      title: "Restaurant Video (MP4)",
      type: "file",
      options: {
        accept: "video/mp4",
      },
    }),
  ],
});