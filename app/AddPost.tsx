"use client"

import { useMutation, useQueryClient } from "react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const queryClient = useQueryClient()
  let toastPostID: string

  //Create a post
  const { mutate } = useMutation(
    async (title: string) =>
      await axios.post("/api/posts/addPost", {
        title,
      }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.error(error)
          toast.error("Error while making the post", { id: toastPostID })
        }
        setIsDisabled(false)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]) //refech data
        toast.success("Post has been made 🔥", { id: toastPostID })
        setTitle("")
        setIsDisabled(false)
      },
    }
  )
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDisabled(true)
    toastPostID = toast.loading("Creating your post", { id: toastPostID })
    mutate(title)
  }

  return (
    <form onSubmit={submitPost} className="addPost">
      <div className="addPost-holder">
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          placeholder="What's on your mind?"
          className="addPost-holder__textarea"
        />
      </div>
      <div className="addPost-actions">
        <p
          className={`${
            title.length > 300 ? "color-red" : "color-gray"
          }`}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          type="submit"
          className="addPost-actions__button"
        >
          Create post
        </button>
      </div>
    </form>
  )
}
