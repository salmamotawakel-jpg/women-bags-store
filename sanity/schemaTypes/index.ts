// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { restaurantType } from "./restaurant"; // أضف هذا
import { addressType } from "./addressType";
import { reviewType } from "./reviewType"; // أضف هذا

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    productType,
    orderType,
    restaurantType,
    addressType,
    reviewType, // أضف هذا
  ],
};