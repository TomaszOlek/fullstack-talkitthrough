"use client"
import { useMutation, useQueryClient } from "react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"

type DeleteWindow = {
  id: string
  postId?: string
  setShowDelete: Function
  setIsDisabled: Function
  actionAt: "comment" | "post"
}

export default function DeleteWindow({setIsDisabled, setShowDelete, actionAt, id, postId}: DeleteWindow) {

  const queryClient = useQueryClient()
  let removeAction: string

  function capitalize(s: string){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
  };

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete(`/api/v1/${actionAt}s`, {
        data: id,
      }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.error(error)
          toast.error(`Error while deleting ${actionAt}.`, { id: removeAction })
          setIsDisabled(false)
        }
      },
      onSuccess: () => {
        setShowDelete(false)
        if(actionAt === "comment"){
          queryClient.invalidateQueries([postId])
        }else{
          queryClient.invalidateQueries(["posts"])
        }
        setIsDisabled(false)
        toast.success(`${capitalize(actionAt)} delited correctly.`, { id: removeAction })
      },
    }
  )
  const handelDelete = async () => {
    setIsDisabled(true)
    setShowDelete(false)
    removeAction = toast.loading(`Deliting your ${actionAt}.`, { id: removeAction })
    mutate(id)
  }

  return (
    <div 
      className="delete_window"
      onClick={() => setShowDelete(false)}
    >
      <div className="delete_window-notification">
        <h2>Delete {actionAt}</h2>
        <p>Are you sure you want to delete this {actionAt}? This will remove the {actionAt} and can't be undone.</p>
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <button 
            className="delete_window-notification-cancel_button"
            onClick={() => setShowDelete(false)}
          > No, Cancel
          </button>
          <button 
            className="delete_window-notification-delete_button"
            onClick={() => handelDelete()}
          > Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}
