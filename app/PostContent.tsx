"use client"
import Image from "next/image"
import { Icon } from '@iconify/react';

import RemoveAction from "./RemoveAction"

interface PostContent {
  id: string;
  title: string;
  setShowReply: Function
  user: {
    name: string;
    image: string;
    email: string;
  };
  userSection: {
    user?: {
      email: string;
      image: string;
      name: string;
    };
  };
}

export default function PostContent({ id, title, user, setShowReply, userSection }: PostContent) {

  return (
    <div>
      <div className="post-header">
        <Image
          className="post-header__avatar"
          width={32}
          height={32}
          src={user.image}
          alt="avatar"
        />
        <h3 className="post-header__name">{user.name}</h3>
        <div className="actions">
          <RemoveAction email={user.email} actionAt="post" id={id} userSection={userSection}/>

          <div 
            className="actions-reply"
            onClick={()=>{setShowReply((prev: boolean)=>!prev)}}
          >
            <Icon 
              icon="fa6-solid:reply" 
              className="icon" 
            />
            <p>Reply</p>
          </div>
        </div>
      </div>
      <div className="post-content">
        <p>{title}</p>
      </div>
    </div>
  )
}
