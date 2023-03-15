"use client"
import axios from "axios"
import { useQuery } from "react-query"
import { useState } from "react";
import { motion } from "framer-motion"

import UnderPost from "./UnderPost"
import Reputation from "./Reputation"
import PostContent from "./PostContent"
import Loader from "./components/Loader"
import { PostsType } from "./types/Posts"

interface PostsProps {
  userSection: {
    user?: {
      email: string;
      image: string;
      name: string;
    };
  };
}

const allPosts = async () => {
  const response = await axios.get("/api/v1/posts")
  return response.data
}

export default function Posts({ userSection }: PostsProps) {
  const [showReply, setShowReply] = useState(false)

  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["allposts"],
  })
  if (error) {
    console.error(error)
    return <>Error ...</>
  }
  if (isLoading) return(
    <Loader />
  )

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
      {data?.map((post) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ ease: "easeOut" }}
          key={post.id}
        >
          <div className="post">  
            <Reputation 
              type="post" 
              reputatuonId={post.id} 
              reactions={post.reactions} 
              userSection={userSection} 
            />
            <PostContent 
              id={post.id} 
              title={post.title} 
              user={post.user} 
              setShowReply={setShowReply}
              userSection={userSection}
            />
          </div>
    
          <UnderPost 
            postId={post.id} 
            showReply={showReply} 
            avatar={post.user.image} 
            setShowReply={setShowReply}
            comments={post.comments}
            userSection={userSection} 
          />
        </motion.div>
      ))}
    </div>
  )
}
