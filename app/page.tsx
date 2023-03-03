"use client"

import { useQuery } from "react-query"
import { PostsType } from "./types/Posts"
import axios from "axios"

import AddPost from "./AddPost"
import Post from "./Post"

const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts")
  return response.data
}

export default function Home() {

  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  })
  if (error) {
    console.error(error)
    return "Error ....."
  }
  if (isLoading) return(
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px"}}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )

  return (
    <main className="postsMain">
      <AddPost/>
      <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
        {data?.map((post) => (
          <Post
            key={post.id}
            email={post.user.email}
            id={post.id}
            name={post.user.name}
            avatar={post.user.image}
            postTitle={post.title}
          />
        ))}
      </div>
    </main>
  )
}
