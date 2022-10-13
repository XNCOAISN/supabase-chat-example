import dynamic from "next/dynamic";
import { deleteChannel, deleteMessage } from "@/lib/utils";
import { useState } from "react";

const Layout = dynamic(
  import("@/components/Layout").then((mod) => mod.Layout),
  { ssr: false }
);

const Home = () => {
  const [channelId, setChannelId] = useState("");
  const [messageId, setMessageId] = useState("");

  const handleDeleteChannel = () => {
    deleteChannel(Number(channelId));
  };

  const handleDeleteMessage = () => {
    deleteMessage(Number(messageId));
  };

  return (
    <Layout>
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold">DEBUG</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Channel ID
          </label>
          <div className="flex space-x-2">
            <input
              className="block px-2 py-1 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
            <button
              className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleDeleteChannel}
            >
              Delete Channel
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message ID
          </label>
          <div className="flex space-x-2">
            <input
              className="block px-2 py-1 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
            />

            <button
              className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleDeleteMessage}
            >
              Delete Message
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
