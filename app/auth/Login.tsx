"use client"

import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <li>
      <button 
        onClick={() => signIn()}
        className="navBar-login"
      >
        Sign In
      </button>
    </li>
  )
}
