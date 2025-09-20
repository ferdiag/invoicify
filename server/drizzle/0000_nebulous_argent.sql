CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact" varchar(255) DEFAULT '',
	"email" varchar(255) DEFAULT '',
	"phone" varchar(50) DEFAULT '',
	"address" varchar(255) DEFAULT '',
	"city" varchar(100) DEFAULT '',
	"zip" varchar(20) DEFAULT '',
	"country" varchar(100) DEFAULT '',
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"invoiceNumber" integer NOT NULL,
	"user_Id" uuid NOT NULL,
	"invoice_date" varchar NOT NULL,
	"due_date" varchar NOT NULL,
	"vat" integer NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"gross_amount" numeric(10, 2) NOT NULL,
	"products" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) DEFAULT '',
	"password" varchar(255) NOT NULL,
	"phone" varchar(50) DEFAULT '',
	"address" varchar(255) DEFAULT '',
	"city" varchar(100) DEFAULT '',
	"zip" varchar(20) DEFAULT '',
	"country" varchar(100) DEFAULT '',
	"taxNumber" varchar(15) DEFAULT '',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_Id_users_id_fk" FOREIGN KEY ("user_Id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customers_user_idx" ON "customers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_unique_user_email" ON "customers" USING btree ("user_id","email");--> statement-breakpoint
CREATE INDEX "invoices_user_idx" ON "invoices" USING btree ("user_Id");--> statement-breakpoint
CREATE INDEX "invoices_customer_idx" ON "invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "invoices_date_idx" ON "invoices" USING btree ("invoice_date");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_unique_user_number" ON "invoices" USING btree ("user_Id","invoiceNumber");