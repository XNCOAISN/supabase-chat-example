import Link from "next/link";
import { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import clsx from "clsx";
import { useChatChannels } from "@/lib/use-chat-channels";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/client";
import { Sign } from "./Sign";

export type LayoutProps = {
  children?: ReactNode;
};

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  const router = useRouter();
  const user = supabase.auth.user();

  if (!user) {
    return (
      <div className="flex min-h-full flex-col sm:mx-auto sm:w-full sm:max-w-md justify-center py-12 sm:px-6 lg:px-8">
        <Sign />
      </div>
    );
  }
  return (
    <div className="flex">
      <div className="inset-y-0 flex w-64 flex-col h-screen">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col py-4 overflow-y-auto">
            <h3 className="px-4 font-bold">Channels</h3>

            <ChannelList
              className="mt-2"
              selectedChannelId={Number(router.query.id)}
            />
          </div>
          <User className="border-t border-gray-200 p-4" />
        </div>
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
};

type ChannelListProps = ComponentPropsWithoutRef<"div"> & {
  selectedChannelId: number;
};

const ChannelList: FC<ChannelListProps> = (props) => {
  const { selectedChannelId, className, ...others } = props;
  const { channels, isLoading, addChannel } = useChatChannels();

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (slug) {
      addChannel(slugify(slug));
    }
  };

  return (
    <div className={clsx("", className)} {...others}>
      <nav className="flex flex-col bg-white px-2 overflow-y-auto">
        {isLoading ? (
          <div className="px-2 text-gray-600">loading...</div>
        ) : null}
        {channels.map((channel) => (
          <Link key={channel.id} href={`/channels/${channel.id}`}>
            <div
              className={clsx(
                channel.id === selectedChannelId
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "flex items-center px-2 py-1 text-sm font-medium rounded-md cursor-pointer"
              )}
            >
              # {channel.slug}
            </div>
          </Link>
        ))}
      </nav>
      <div className="mt-2 px-2">
        <button
          className="flex w-full justify-center items-center px-2 py-1 text-sm font-medium rounded-md cursor-pointer text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-gray-900"
          onClick={newChannel}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2">New Channel</span>
        </button>
      </div>
    </div>
  );
};

type UserProps = ComponentPropsWithoutRef<"div">;

const User: FC<UserProps> = (props) => {
  const { className, ...others } = props;
  const user = supabase.auth.user();

  if (!user) {
    return null;
  }

  return (
    <div className={clsx("flex items-center", className)} {...others}>
      <div className="ml-3 flex flex-col">
        <div className="text-sm font-medium text-gray-700">{user.email}</div>
        <div className="inline-flex">
          <a
            className="text-xs font-medium text-gray-500 hover:text-gray-700"
            href="/"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
