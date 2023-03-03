"use client"
import Image from "next/image"
import { useState } from "react";
import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Comments from "./Comments"

type Comment = {
  postId: string
  showReply: boolean
  avatar: string
  setShowReply: Function 
}


export default function UnderPost({postId, showReply, avatar, setShowReply}:Comment) {

  const { mutate } = useMutation(
    async (data: {
      postId: string
      comment: string
    }) => {
      return axios.post("/api/comments/addComment", { data })
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([postId])
        setComment("")
        setShowReply(false)
        setIsDisabled(false)
        toast.success("Added your comment.", { id: toastCommentId })
      },
      onError: (error) => {
        setIsDisabled(false)
        if (error instanceof AxiosError) {
          toast.error(
            "There was an Error when makina a comment.",
            { id: toastCommentId }
          )
        }
      },
    }
  )

  const queryClient = useQueryClient()
  let toastCommentId: string
  const [comment, setComment] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDisabled(true)
    toastCommentId = toast.loading("Adding your comment.", {
      id: toastCommentId,
    })
    mutate({ comment, postId })
  }

  return (
    <motion.div 
      className="post-comments"
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ ease: "easeOut" }}
    >
        <Comments postId={postId}/>

        {showReply &&
          <form onSubmit={submitComment} className="post-comments-replay">
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginRight: "5px"
              }}
            >
              <Image
                className="post-comments-replay__avatar"
                width={46}
                height={46}
                src={avatar}
                alt="avatar"
              />
              <p
                style={{
                  margin: `30px ${comment.length>999 ? 10 : 0}px 0 0`
                }}
                className={`${
                  comment.length > 300 ? "color-red" : "color-gray"
                }`}
              >
                {comment.length>999 ? `+999/300` : `${comment.length}/300`}
              </p>
            </div>
           <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              name="comment"
              placeholder="What's on your mind?"
              className="post-comments-replay__textarea"
            />
            <button
              disabled={isDisabled}
              type="submit"
              className="post-comments-replay__button"
            >
              Comment
            </button>
        </form>
      }
    </motion.div>
  )
}
