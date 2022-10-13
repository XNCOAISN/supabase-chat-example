import { supabase } from "./client";
import { Channel, Message, User, UserRole } from "./types";

export const fetchUser = async (userId: string) => {
  try {
    const { data } = await supabase
      .from<User>("users")
      .select("*,user_roles(*)")
      .eq("id", userId)
      .single();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchUserRoles = async (userId: string, channelId: number) => {
  try {
    const { data } = await supabase
      .from<UserRole>("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("channel_id", channelId);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchChannel = async (channelId: number) => {
  try {
    const { data } = await supabase
      .from<Channel>("channels")
      .select("*")
      .eq("id", channelId)
      .single();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchChannels = async () => {
  try {
    const { data } = await supabase.from<Channel>("channels").select("*");
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const addChannel = async (slug: string, userId: string) => {
  try {
    const { data } = await supabase
      .from<Channel>("channels")
      .insert([{ slug, created_by: userId }]);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteChannel = async (channelId: number) => {
  try {
    const { body } = await supabase
      .from<Channel>("channels")
      .delete()
      .match({ id: channelId });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchMessages = async (channelId: number) => {
  try {
    const { data } = await supabase
      .from<Message>("messages")
      .select("*,author:users(*)")
      .eq("channel_id", channelId)
      .order("inserted_at", { ascending: true });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const addMessage = async (
  message: string,
  channelId: number,
  userId: string
) => {
  try {
    const { data } = await supabase
      .from<Message>("messages")
      .insert([{ message, channel_id: channelId, user_id: userId }]);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteMessage = async (messageId: number) => {
  try {
    const { data } = await supabase
      .from<Message>("messages")
      .delete()
      .match({ id: messageId });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const inviteUser = async (email: string, channelId: number) => {
  try {
    const { data } = await supabase.rpc<UserRole>("invite_user", {
      channel_id: channelId,
      email,
    });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
