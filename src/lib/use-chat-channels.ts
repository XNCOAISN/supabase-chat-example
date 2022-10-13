import { useState, useEffect } from "react";
import { supabase } from "./client";
import { Channel } from "@/lib/types";
import * as utils from "./utils";

export const useChatChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = supabase.auth.user();

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      setIsLoading(true);

      await fetchChannels();

      const channelListener = supabase
        .from<Channel>("channels")
        .on("INSERT", (payload) => handleNewChannel(payload.new))
        .on("DELETE", (payload) => handleDeletedChannel(payload.old))
        .subscribe();

      setIsLoading(false);

      return () => {
        channelListener.unsubscribe();
      };
    })();
  }, [user]);

  const handleNewChannel = (channel: Channel) => {
    setChannels((v) => v.concat(channel));
  };

  const handleDeletedChannel = (channel: Channel) => {
    setChannels((v) => v.filter((value) => value.id !== channel.id));
  };

  const fetchChannels = async () => {
    const data = await utils.fetchChannels();
    setChannels(data);
    return data;
  };

  const addChannel = async (slug: string) => {
    return await utils.addChannel(slug, user.id);
  };

  const deleteChannel = async (channelId: number) => {
    return await utils.deleteChannel(channelId);
  };

  return {
    channels: channels?.sort((a, b) => a.slug.localeCompare(b.slug)),
    isLoading,
    addChannel,
    deleteChannel,
  };
};
