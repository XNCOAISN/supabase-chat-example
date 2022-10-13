import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from "react";

import { Message } from "@/components/Message";
import { MessageInput } from "@/components/MessageInput";
import { ChatChannelProvider } from "@/lib/ChatChannelProvider";
import { useChatMessages } from "@/lib/use-chat-messages";
import { useChatChannel } from "@/lib/use-chat-channel";

const Layout = dynamic(
  import("@/components/Layout").then((mod) => mod.Layout),
  { ssr: false }
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

type Params = {
  channelId: string;
};
type Props = Params;

export const getStaticProps: GetStaticProps<Props, Params> = (context) => {
  return {
    props: context.params,
  };
};

const ChannelsPage: NextPage<Props> = (props) => {
  const channelId = Number(props.channelId);
  const { userRoles } = useChatChannel({ channelId });

  return (
    <Layout>
      <ChatChannelProvider value={{ userRoles }}>
        <div className="relative h-screen flex flex-col">
          <Header channelId={channelId} />
          <MessageContainer className="flex-1" channelId={channelId} />
        </div>
      </ChatChannelProvider>
    </Layout>
  );
};

type HeaderProps = ComponentPropsWithoutRef<"div"> & {
  channelId: number;
};

const Header: FC<HeaderProps> = (props) => {
  const { channelId, className, ...others } = props;
  const { channel, inviteUser } = useChatChannel({ channelId });

  const handleInviteUser = () => {
    const email = prompt("Please enter invite email");
    if (email) {
      inviteUser(email);
    }
  };

  return (
    <div className={clsx("flex px-4 py-2 border-b", className)} {...others}>
      <h2 className="text-xl font-bold">{channel?.slug}</h2>
      <button
        className="w-8 h-8 ml-auto rounded-md hover:bg-gray-200"
        onClick={handleInviteUser}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    </div>
  );
};

type MessageContainerProps = ComponentPropsWithoutRef<"div"> & {
  channelId: number;
};

const MessageContainer: FC<MessageContainerProps> = (props) => {
  const { channelId, className, ...others } = props;
  const { messages, isLoading, addMessage, deleteMessage } = useChatMessages({
    channelId,
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
    });
  }, [messages]);

  const handleDelete = (messageId: number) => {
    deleteMessage(messageId);
  };

  return (
    <div
      className={clsx("flex flex-col overflow-hidden", className)}
      {...others}
    >
      <div className="flex-1 flex flex-col-reverse overflow-hidden">
        <div className="p-2 overflow-y-scroll">
          {isLoading ? <div className="px-5">Loading</div> : null}
          {messages.map((x) => (
            <Message key={x.id} message={x} onDelete={handleDelete} />
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <div className="p-2 w-full">
        <MessageInput onSubmit={async (text: string) => addMessage(text)} />
      </div>
    </div>
  );
};

export default ChannelsPage;
