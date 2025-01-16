CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"password" text,
	"createdAt" timestamp DEFAULT now(),
	"2fa_secret" text,
	"2fa_activated" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
