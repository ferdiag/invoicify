ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_items" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;