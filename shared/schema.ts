import { pgTable, text, serial, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  handle: text("handle"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  brand: text("brand").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviewCount: integer("review_count").default(0),
  image: text("image").notNull(),
  images: text("images").array(),
  colors: text("colors").array(),
  specs: jsonb("specs").$type<Record<string, string>>(),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  stock: integer("stock").notNull().default(100),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Cart Item type (client-side only usually, but good to have a shape)
export type CartItem = Product & {
  quantity: number;
  selectedColor?: string;
  variantId?: string;
};
