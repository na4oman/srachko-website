CREATE TYPE "public"."request_status" AS ENUM('Нова/Получена', 'Необработена', 'За проверяване', 'Отговорено/Потвърдена', 'В процес', 'Изчаква части', 'Завършена', 'Отказана');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('Ремонт', 'Монтаж', 'Профилактика', 'Запитване за част', 'Регистрация на уреди', 'Контакт');--> statement-breakpoint
CREATE TYPE "public"."warranty_status" AS ENUM('Да', 'Не', 'Не знам');--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_type" "request_type" NOT NULL,
	"status" "request_status" DEFAULT 'Нова/Получена' NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"serial_number" varchar(100),
	"city" varchar(100),
	"district" varchar(100),
	"street" varchar(200),
	"street_number" varchar(20),
	"block" varchar(20),
	"entrance" varchar(20),
	"floor" varchar(20),
	"apartment" varchar(20),
	"complaint" text,
	"additional_info" text,
	"warranty_status" "warranty_status",
	"preferred_date" timestamp,
	"language" varchar(2) DEFAULT 'bg' NOT NULL,
	"image_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"author_name" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"from_status" "request_status" NOT NULL,
	"to_status" "request_status" NOT NULL,
	"changed_by" varchar(255) NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;