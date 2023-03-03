import { getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

import Login from "./auth/Login"
import Logged from "./auth/Logged"
import Link from "next/link"

export default async function Nav() {
  const session = await getServerSession(authOptions)

  return (
    <nav className="navBar">
      <Link href={"/"} className="navBar-logo">
        <h1>TalkItThrough</h1>
      </Link>
      <ul style={{listStyle:"none"}}>
        {!session?.user && <Login />}
        {session?.user && <Logged image={session.user.image || ""} />}
      </ul>
    </nav>
  )
}
