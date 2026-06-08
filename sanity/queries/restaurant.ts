// sanity/queries/restaurant.ts
import { client } from "@/sanity/lib/client";

export const getRestaurantVideo = async () => {
  const query = `*[_type == "restaurant"][0] {
    "video": video.asset->url
  }`;
  
  const data = await client.fetch(query);
  return data?.video || null;
};