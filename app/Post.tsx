"use client"
import Image from "next/image"
import { useState } from "react";
import { motion } from "framer-motion"
import { Icon } from '@iconify/react';

import UnderPost from "./UnderPost"
import Reputation from "./Reputation"
import RemoveAction from "./RemoveAction"

type Post = {
  id: string
  name: string
  avatar: string
  postTitle: string
  email: string
}

export default function Post({ id, name, avatar, postTitle, email }:Post) {

  const [showReply, setShowReply] = useState(false)

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ ease: "easeOut" }}
    >
      <div className="post">  
        <Reputation type="post" reputatuonId={id} />

        <div>
          <div className="post-header">
            <Image
              className="post-header__avatar"
              width={32}
              height={32}
              src={avatar}
              alt="avatar"
            />
            <h3 className="post-header__name">{name}</h3>
            <div className="actions">
              <RemoveAction email={email} actionAt="post" id={id}/>

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
            <p>{postTitle}</p>
          </div>
        </div>
      </div>

      <UnderPost 
        postId={id} 
        showReply={showReply} 
        avatar={avatar} 
        setShowReply={setShowReply}
      />
    </motion.div>
  )
}
