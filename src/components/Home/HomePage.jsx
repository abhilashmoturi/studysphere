"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";

function HomePage({ currentUser }) {
  const [profile, setProfile] = useState([]);
  const [user, setUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const getProfile = async () => {
      const res = await axios.post("/api/get-quizzes-taken", {
        userId: currentUser.id,
      });
      setProfile(res.data);
    };
    getProfile();
    const getUser = async () => {
      try {
        const res = await axios.post("/api/all-users", {
          profileId: currentUser.id,
        });
        setUser(res.data.profileUser);
        setAllUsers(res.data.users);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);
  const router = useRouter();
  return (
    <div className="m-5 border flex h-full">
      <div className="w-[75%] p-5">
        <div className="flex gap-4">
          <div>
            <Image
              src={currentUser.image}
              width={100}
              height={100}
              className="rounded"
              alt="profile"
            />
          </div>
          <div className="flex flex-col justify-between">
            <h1>{currentUser.email}</h1>
            <h1>{currentUser.id}</h1>
            <h1>{currentUser.name}</h1>
            <h1>{currentUser.createdAt.toString()}</h1>
          </div>
        </div>
        <table className="w-1/2 m-auto mt-12">
          <thead>
            <tr>
              <th className="p-2 border-b">id</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Points</th>
            </tr>
          </thead>
          <tbody>
            {profile.map((quiz) => {
              return (
                <tr
                  onClick={() => router.push(`/manage-quiz/${quiz.id}`)}
                  className="hover:bg-gray-100 cursor-pointer"
                  key={quiz.id}
                >
                  <td className="p-2 border-b">{quiz.id}</td>
                  <td className="p-2 border-b">{quiz.Quiz.name}</td>
                  <td className="p-2 border-b">{quiz.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border p-5 w-[25%]">
        Friends
        {allUsers
          .filter((user) => user.isFriend && user.id !== currentUser.id)
          .map((user) => {
            return (
              <div
                className="flex items-center gap-2 cursor-pointer p-2 border border-b rounded-md justify-between hover:bg-gray-100"
                key={user.id}
              >
                <div className="flex gap-2 items-center">
                  <Image
                    src={user.image}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="profile"
                  />
                  <h1>{user.name}</h1>
                </div>

                {user.isFriend ? (
                  <span className="text-cyan-500 flex items-center gap-2 cursor-pointer">
                    <FaCheckCircle />
                  </span>
                ) : (
                  <span
                    className="text-cyan-500 flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFriend(user.id);
                    }}
                  >
                    <IoMdPersonAdd className="text-xl" />
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HomePage;
