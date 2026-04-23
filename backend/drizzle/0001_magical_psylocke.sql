CREATE INDEX "idx_requests_status" ON "service_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_requests_type" ON "service_requests" USING btree ("request_type");--> statement-breakpoint
CREATE INDEX "idx_requests_brand" ON "service_requests" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "idx_requests_created_at" ON "service_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_requests_email" ON "service_requests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_notes_request_id" ON "request_notes" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "idx_history_request_id" ON "status_history" USING btree ("request_id");