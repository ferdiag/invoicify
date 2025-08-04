ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customer_Id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "user_Id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_Id_users_id_fk" FOREIGN KEY ("user_Id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "customer_Id";