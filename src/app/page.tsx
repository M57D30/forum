import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import SubFeed from "@/components/SubFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExtendedSub } from "@/types/db";
import { Home as HomeIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();

  const subs = (await db.subreddit.findMany({
    select: {
      name: true,
      id: true,
      Creator: {
        select: {
          image: true,
          username: true,
        },
      },
    },
  })) as ExtendedSub[];

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/r/create`}
            >
              Create Community
            </Link>
          </dl>
          <hr />
          <dl className="mt-10">
            <h1 className="font-bold text-3xl md:text-4xl pl-3 mb-3">
              Explore{" "}
            </h1>
            <SubFeed subreddits={subs} />
          </dl>
        </div>
      </div>
    </>
  );
}
