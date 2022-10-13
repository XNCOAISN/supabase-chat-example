import { FC } from "react";
import TrashIcon from "@/components/TrashIcon";
import { useChatChannelContext } from "@/lib/ChatChannelProvider";
import { Message as MessageType } from "@/lib/types";
import { supabase } from "@/lib/client";

export type MessageProps = {
  message: MessageType;
  onDelete: (messageId: number) => void;
};

export const Message: FC<MessageProps> = (props) => {
  const { message, onDelete } = props;
  const user = supabase.auth.user();
  const { userRoles } = useChatChannelContext();

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-1 w-full flex items-center space-x-2 group hover:bg-gray-100 rounded-md">
      <div className="flex-1">
        <p className="text-blue-700 font-bold">{message.author.username}</p>
        <p className="text-gray-900">{message.message}</p>
      </div>
      <div className="ml-auto">
        <div className="text-gray-900 w-4 flex">
          {(user.id === message.user_id ||
            userRoles.some((role) =>
              ["admin", "moderator"].includes(role.role)
            )) && (
            <button
              className="hidden group-hover:block"
              onClick={() => onDelete(message.id)}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
