"use client"
import axios from "axios"
import Image from "next/image"
import { useQuery } from "react-query"
import { CommentsType } from "./types/CommentsType"
import toast from "react-hot-toast"

import RemoveAction from "./RemoveAction"
import Reputation from "./Reputation"


const allComments = async (postId: string) => {
  const response = await axios.get(`/api/comments/${postId}`)
  return response.data
}

export default function UnderPost({postId}: {postId: string}) {
  const { data, error, isLoading } = useQuery<CommentsType[]>({
    queryFn: () => allComments(postId),
    queryKey: [postId],
  })

  if (error) {
    toast.error("Error while loading comments")
    console.error(error)
    return <></>
  }
  if (isLoading){
    return(
      <div style={{alignSelf: "center"}}>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }
  

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
      {data?.map((comment) => (
        <div className="comment" key={comment.id}>
          <Reputation type="comment" reputatuonId={comment.id}/>
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
                <RemoveAction email={comment.user.email} actionAt="comment" id={comment.id} postId={postId}/>
              </div>
            </div>
            <div className="comment-content">
              <p>{comment.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
