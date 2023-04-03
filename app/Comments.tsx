"use client";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import { CommentsType } from "./types/CommentsType";
import toast from "react-hot-toast";

import RemoveAction from "./RemoveAction";
import Reputation from "./Reputation";
import { useEffect, useState } from "react";

const allComments = async (postId: string) => {
  const response = await axios.get(`/api/v1/comments/${postId}`);
  return response.data;
};

interface Comments {
  postId: string;
  comments: {
    createdAt?: string;
    id: string;
    postId: string;
    title: string;
    userId: string;
    user: {
      email: string;
      id: string;
      image: string;
      name: string;
    };
    reactions: {
      id: string;
      type: string;
      user: {
        name: string;
        image: string;
        email: string;
      };
    }[];
  }[];
  userSection: {
    user?: {
      email: string;
      image: string;
      name: string;
    };
  };
}

export default function Comments({ postId, comments, userSection }: Comments) {
  const [commnetsData, setCommentsData] = useState<CommentsType[]>([]);

  const { data, error } = useQuery<CommentsType[]>({
    queryFn: () => allComments(postId),
    queryKey: [postId],
  });
  if (error) {
    toast.error("Error while loading comments");
    console.error(error);
    return <></>;
  }

  useEffect(() => {
    if (data) {
      setCommentsData(data);
    } else {
      setCommentsData(comments);
    }
  }, [data]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {commnetsData?.map((comment) => (
        <div className="comment" key={comment.id}>
          <Reputation
            type="comment"
            reputatuonId={comment.id}
            reactions={comment.reactions}
            userSection={userSection}
          />
          <div>
            <div className="comment-header">
              <Image
                className="comment-header__avatar"
                width={32}
                height={32}
                src={comment.user.image}
                alt="avatar"
              />
              <h3 className="comment-header__name">{comment.user.name}</h3>
              <div className="actions">
                <RemoveAction
                  email={comment.user.email}
                  actionAt="comment"
                  id={comment.id}
                  postId={postId}
                  userSection={userSection}
                />
              </div>
            </div>
            <div className="comment-content">
              <p>{comment.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
