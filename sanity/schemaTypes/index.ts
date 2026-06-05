// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { addressType } from "./addressType";
import { reviewType } from "./reviewType"; // أضف هذا

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    productType,
    orderType,
    addressType,
    reviewType, // أضف هذا
  ],
};