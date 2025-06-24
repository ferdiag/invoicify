CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) DEFAULT '',
	"phone" varchar(50) DEFAULT '',
	"address" varchar(255) DEFAULT '',
	"city" varchar(100) DEFAULT '',
	"zip" varchar(20) DEFAULT '',
	"country" varchar(100) DEFAULT '',
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;