"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import Postas from "./Post";
import { useSession } from "next-auth/react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditId: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditId }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query", subredditId], // Include `subredditId` in query key for caching
    async ({ pageParam = 1 }) => {
      // Construct API URL dynamically based on whether `subredditId` is defined
      const query = subredditId
        ? `/api/posts/${subredditId}?page=${pageParam}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`
        : `/api/posts?page=${pageParam}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`;

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1, // Increment page number for fetching next
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <div>
      {posts.length === 0 ? (
        <li className="h-full px-6 py-4 flex justify-between gap-6">
          <p>No posts created yet.</p>
        </li>
      ) : (
        <ul className="flex flex-col col-span-2 space-y-6">
          {posts.map((post, index) => {
            const votesAmt = post.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const currentVote = post.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            if (index === posts.length - 1) {
              // Add a ref to the last post in the list
              return (
                <li key={post.id} ref={ref}>
                  <Postas
                    post={post}
                    commentAmt={post.comments.length}
                    subredditName={post.subreddit.name}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                  />
                </li>
              );
            } else {
              return (
                <Postas
                  key={post.id}
                  post={post}
                  commentAmt={post.comments.length}
                  subredditName={post.subreddit.name}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                />
              );
            }
          })}

          {isFetchingNextPage && (
            <li className="flex justify-center">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default PostFeed;
