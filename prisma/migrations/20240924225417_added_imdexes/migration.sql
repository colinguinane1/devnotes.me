-- CreateIndex
CREATE INDEX "Author_email_idx" ON "public"."Author"("email");

-- CreateIndex
CREATE INDEX "Author_username_idx" ON "public"."Author"("username");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "public"."Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "public"."Comment"("postId");

-- CreateIndex
CREATE INDEX "Post_user_id_idx" ON "public"."Post"("user_id");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "public"."Post"("slug");

-- CreateIndex
CREATE INDEX "Reply_authorId_idx" ON "public"."Reply"("authorId");

-- CreateIndex
CREATE INDEX "Reply_commentId_idx" ON "public"."Reply"("commentId");

-- CreateIndex
CREATE INDEX "Subscription_subscriberId_idx" ON "public"."Subscription"("subscriberId");

-- CreateIndex
CREATE INDEX "Subscription_subscribedToId_idx" ON "public"."Subscription"("subscribedToId");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "public"."Tag"("name");
