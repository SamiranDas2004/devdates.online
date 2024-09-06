"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "../../utils/socket";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  fromUser: string;
  message: string;
  timestamp: string;
  id: string; // Add a unique identifier for each message
}

const ChatContent: React.FC = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("userEmail");
  const targetUserEmail = searchParams.get("targetUserEmail");
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortMessagesByTimestamp = (messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
  };

  useEffect(() => {
    if (userEmail) {
      socket.emit("joinRoom", userEmail);

      socket.on("receiveMessage", (newMessage: Message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          return sortMessagesByTimestamp(updatedMessages);
        });
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userEmail || !targetUserEmail) return;

      try {
        const response = await axios.post("/api/recivesavedmassages", {
          fromUser: userEmail,
          toUser: targetUserEmail,
        });

        const { receivedMessages, sentMessages } = response.data;

        const processMessages = (msgs: any[]): Message[] =>
          msgs.flatMap((msg: any) =>
            Array.isArray(msg.message)
              ? msg.message.map((individualMessage: string, index: number) => ({
                  fromUser: msg.fromUser,
                  message: individualMessage,
                  timestamp: msg.timestamp,
                  id: `${msg.fromUser}-${msg.timestamp}-${index}`,
                }))
              : [
                  {
                    fromUser: msg.fromUser,
                    message: msg.message,
                    timestamp: msg.timestamp,
                    id: `${msg.fromUser}-${msg.timestamp}`,
                  },
                ]
          );

        const allMessages = [
          ...processMessages(receivedMessages),
          ...processMessages(sentMessages),
        ];

        setMessages(sortMessagesByTimestamp(allMessages));
      } catch (error: any) {
        console.log("Error fetching or sorting messages:", error);
      }
    };

    fetchMessages();
  }, [userEmail, targetUserEmail]);

  const handleNavigate = (email: string) => {
    router.replace(
      `/chat?userEmail=${session?.user.email}&targetUserEmail=${email}`
    );
  };

  const sendMessage = async () => {
    if (message.trim() !== "" && userEmail && targetUserEmail) {
      const newMessage: Message = {
        fromUser: userEmail,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        id: `${userEmail}-${Date.now()}`,
      };

      setMessages((prevMessages) =>
        sortMessagesByTimestamp([...prevMessages, newMessage])
      );
      socket.emit("sendMessage", newMessage);

      try {
        await axios.post("/api/savemessages", newMessage);
      } catch (error) {
        console.error("Error sending message to server:", error);
      }

      setMessage("");
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const Showpeople = async () => {
        try {
          const res = await axios.post("/api/getthefuckingmatches", {
            email: session.user.email,
          });
          setUserInfo(res.data.data);
        } catch (error) {
          console.log(error);
        }
      };
      Showpeople();
    }
  }, [session, status]);

  return (
    <div className="grid grid-cols-4  h-[91vh] bg-white">
      <div className="overflow-y-auto bg-white w-2/3 h-screen p-4">
        {userInfo.map((user) => (
          <div key={user.email}>
            {user.photos && user.photos.length > 0 ? (
              <>
                <Image
                  onClick={() => handleNavigate(user.email)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  src={user.photos[0]}
                  alt={user.username}
                  width={80}
                  height={80}
                />
                <div>{user.username}</div>
              </>
            ) : (
              <div>&quot;&quot;</div>
            )}
          </div>
        ))}
      </div>
      <div className="col-span-2-4 flex flex-col"> {/* Correct comment placement */}
  <div className="flex-1 p-4 border border-gray-300 rounded-lg shadow-md flex flex-col">
    <div className="overflow-y-auto flex-1">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-3 flex ${
            msg.fromUser === userEmail ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`inline-block px-4 py-2 rounded-lg ${
              msg.fromUser === userEmail
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } shadow-md`}
          >
            {msg.message}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  </div>
  <div className="flex gap-2 mt-2 p-4">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Type a message..."
    />
    <button
      onClick={sendMessage}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
    >
      Send
    </button>
  </div>
</div>

    </div>
  );
};

const Chat: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
};

export default Chat;
