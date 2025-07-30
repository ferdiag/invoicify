CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_Id" uuid NOT NULL,
	"invoice_date" varchar NOT NULL,
	"due_date" varchar NOT NULL,
	"vat" integer NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"gross_amount" numeric(10, 2) NOT NULL,
	"products" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_Id_users_id_fk" FOREIGN KEY ("customer_Id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;