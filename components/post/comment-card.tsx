import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatCommentDate } from "@/data/SiteData";
import ReplyButton from "../buttons/ReplyButton";
import { Author, Comment } from "@prisma/client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { BsArrowReturnRight } from "react-icons/bs";

interface CommentCardProps {
  comment: any;
  Reply: any;
}

export default function CommentCard({ comment, Reply }: CommentCardProps) {
  return (
    <main className="flex flex-col items-start border rounded-lg px-4 w-full gap-4">
      <div>
        <div className="flex-1</div> w-full">
          <div className="flex items-center w-full gap-2">
            <Link
              className="flex items-center gap-2 no-underline"
              href={`/profile/${comment.author.username}`}
            >
              {comment.author.image_url && comment.author.username ? (
                <Avatar className="flex-shrink-0">
                  <AvatarImage
                    className="-mt-[1px]"
                    src={comment.author.image_url}
                    alt={comment.author.username}
                  />
                </Avatar>
              ) : (
                <Avatar className="flex-shrink-0">
                  <AvatarFallback>
                    {comment.author.username ? comment.author.username[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <p className="font-medium text-gray-900 dark:text-white">
                {comment.author.username}
              </p>
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatCommentDate(comment.createdAt)}
            </span>
          </div>
          <div className="flex justify-between w-full items-center">
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mx-4 items-center">
        <Accordion.Root className="w-full" type="single" id={comment.id}>
          {comment.Reply.length > 0 && (
            <Accordion.Trigger className="-ml-4" id={comment.id}>
              <div className="flex font-bold  items-center min-w-fit w-full">
                {comment.Reply.length} replies <ChevronDownIcon />
              </div>
            </Accordion.Trigger>
          )}
          <Accordion.Content className="w-full -ml-4 border-none data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            {comment.Reply.map((reply: any) => (
              <Accordion.Item
                className="w-full p-2"
                key={reply.id}
                value={`reply-${reply.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1</div>">
                    <div className="flex items-center gap-2">
                      {" "}
                      <Link
                        className="flex items-center gap-2 no-underline"
                        href={`/profile/${reply.author.username}`}
                      >
                        {reply.author.image_url && reply.author.username ? (
                          <Avatar className="flex-shrink-0">
                            <AvatarImage
                              className="-mt-[1px]"
                              src={reply.author.image_url}
                              alt={reply.author.username}
                            />
                          </Avatar>
                        ) : (
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>
                              {reply.author.username
                                ? reply.author.username[0]
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <p className="font-medium text-gray-900 dark:text-white">
                          {reply.author.username}
                        </p>
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCommentDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                  </div>
                </div>{" "}
              </Accordion.Item>
            ))}
          </Accordion.Content>
        </Accordion.Root>{" "}
        <ReplyButton comment={comment} author={comment.author} />
      </div>
    </main>
  );
}
