"use client"

import Image from "next/image"
import { signOut } from "next-auth/react"
import Link from "next/link"

type User = {
  image: string
}

export default function Logged({ image }: User) {
  return (
    <li className="navBar-logout">
      <button onClick={() => signOut()} className="navBar-logout-button">
        Sign Out
      </button>
      {/* <Link href={"/dashboard"}> */}
        <Image
          width={48}
          height={48}
          src={image}
          className="navBar-logout-avatar"
          alt=""
          priority
        />
      {/* </Link> */}
    </li>
  )
}
