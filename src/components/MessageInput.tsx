import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";

export type MessageInputProps = {
  onSubmit: any;
};

export const MessageInput: FC<MessageInputProps> = (props) => {
  const { onSubmit } = props;
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    onSubmit(messageText);
    setMessageText("");
  };

  return (
    <div className="flex">
      <input
        className="flex-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Send a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => submitOnEnter(e)}
      />
      <button className="p-2" type="submit" onClick={handleSubmit}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};
