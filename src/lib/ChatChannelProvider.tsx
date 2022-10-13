import { createContext, useContext } from "react";
import { User, UserRole } from "./types";

type ChatChannelContextType = {
  userRoles: UserRole[];
};

export const ChatChannelContext = createContext<ChatChannelContextType>({
  userRoles: [],
});

export const ChatChannelProvider = ChatChannelContext.Provider;

export const useChatChannelContext = () => {
  return useContext(ChatChannelContext);
};
