import { Badge } from "@/components/ui/badge";
import { getUserTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../RenderTag";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const userTag = await getUserTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light-100 dark:shadow-none  w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className=" background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user image"
          width={100}
          height={100}
          className="rounded-full aspect-square object-cover"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold line-clamp-1 text-dark500_light500">
            {user.name}
          </h3>
          <p className="primary-text-gradient font-semibold">@ {user.username}</p>
        </div>
        <div className="mt-5">
          {userTag.length > 0 ? (
            <div className="flex items-center gap-2">
              {userTag.map((tag) => (
                <RenderTag key={tag._id} _id={String(tag._id)} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
