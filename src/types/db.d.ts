import type { Post, Subreddit, User, Vote, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type ExtendedSub = {
  id: string;
  name: string;
  Creator: {
    image: string;
    username: string;
  };
};
