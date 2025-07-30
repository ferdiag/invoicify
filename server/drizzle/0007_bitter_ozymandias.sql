ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customer_Id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_Id_customers_id_fk" FOREIGN KEY ("customer_Id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;