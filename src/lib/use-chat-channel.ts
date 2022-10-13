import { useState, useEffect } from "react";
import { Channel, User, UserRole } from "@/lib/types";
import { supabase } from "./client";
import * as utils from "./utils";

type UseChatChannelProps = {
  channelId: number;
};

export const useChatChannel = (props: UseChatChannelProps) => {
  const { channelId } = props;
  const user = supabase.auth.user();

  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      setIsLoading(true);

      await Promise.all([fetchUserRoles(), fetchChannel()]);

      setIsLoading(false);
    })();
  }, [user, channelId]);

  const fetchUserRoles = async () => {
    const data = await utils.fetchUserRoles(user.id, channelId);
    setUserRoles(data);
    return data;
  };

  const fetchChannel = async () => {
    const data = await utils.fetchChannel(channelId);
    setChannel(data);
    return data;
  };

  const inviteUser = async (email: string) => {
    return utils.inviteUser(email, channelId);
  };

  return {
    userRoles,
    channel,
    isLoading,
    inviteUser,
  };
};
