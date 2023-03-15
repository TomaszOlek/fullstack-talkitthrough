import { getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

import AddPost from "./AddPost"
import Posts from "./Posts"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="postsMain">
      <AddPost/>
      <Posts userSection={{
        user: {
          email: session?.user?.email ?? '',
          image: session?.user?.image ?? '',
          name: session?.user?.name ?? '',
        }
      }} />
    </main>
  )
}