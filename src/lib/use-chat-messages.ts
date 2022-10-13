import { useState, useEffect } from "react";
import { Message, User } from "@/lib/types";
import { supabase } from "./client";
import * as utils from "./utils";

type UseChatMessagesProps = {
  channelId: number;
};

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { channelId } = props;
  const user = supabase.auth.user();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      setIsLoading(true);

      await fetchMessages();

      const messageListener = supabase
        .from<Message>("messages")
        .on("INSERT", (payload) => handleNewMessage(payload.new))
        .on("DELETE", (payload) => handleDeletedMessage(payload.old))
        .subscribe();

      const userListener = supabase
        .from<User>("users")
        .on("*", (payload) => handleNewOrUpdatedUser(payload.new))
        .subscribe();

      setIsLoading(false);

      return () => {
        messageListener.unsubscribe();
        userListener.unsubscribe();
      };
    })();
  }, [user, channelId]);

  const handleNewMessage = (message: Message) => {
    (async () => {
      const authorId = message.user_id;
      if (!users.get(authorId)) await fetchUser(authorId);
      setMessages((v) => v.concat(message));
    })();
  };

  const handleDeletedMessage = (message: Message) => {
    setMessages((v) => v.filter((v) => v.id !== message.id));
  };

  const handleNewOrUpdatedUser = (user: User) => {
    users.set(user.id, user);
  };

  const fetchUser = async (userId: string) => {
    const data = await utils.fetchUser(userId);
    handleNewOrUpdatedUser(data);
    return data;
  };

  const fetchMessages = async () => {
    const data = await utils.fetchMessages(channelId);
    data.forEach((v) => users.set(v.user_id, v.author));
    setMessages(data);
    return data;
  };

  const addMessage = async (message: string) => {
    return utils.addMessage(message, channelId, user.id);
  };

  const deleteMessage = async (messageId: number) => {
    return utils.deleteMessage(messageId);
  };

  return {
    messages: messages.map((v) => ({ ...v, author: users.get(v.user_id) })),
    isLoading,
    addMessage,
    deleteMessage,
  };
};
