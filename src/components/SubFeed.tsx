"use client";
import { ExtendedSub } from "@/types/db";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { UserAvatar } from "./UserAvatar";
import Link from "next/link";

interface SubFeedProps {
  subreddits: ExtendedSub[];
}

const SubFeed: FC<SubFeedProps> = ({ subreddits }) => {
  const { data: session } = useSession();

  if (subreddits.length === 0) {
    return (
      <div className="text-center bg-slate-300 rounded-md p-5">
        No existing subreddits :/
      </div>
    );
  }

  return (
    <div className="px-3 mb-20">
      {subreddits.map((subreddit) => (
        <Link href={`/r/${subreddit.name}`} key={subreddit.id}>
          <div className="flex columns-2 gap-x-4 bg-neutral- rounded-md my-2 hover:bg-slate-200">
            <div className="p-2">
              <UserAvatar
                user={{
                  name: session?.user.name || null,
                  image: subreddit.Creator?.image || null,
                }}
              />
            </div>
            <div>
              <p className="font-bold">/r/{subreddit.name}</p>
              <p>{subreddit.Creator?.username}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubFeed;
