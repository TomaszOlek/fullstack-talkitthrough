import prisma from "../../prisma/client"
import { authOptions } from "./auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try{
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        return res
          .status(401)
          .json({ message: "No current Session." })
      }

      const prismaUser = await prisma.user.findUnique({
        where: { email: session.user?.email },
      })

      return res.status(200).json(prismaUser)
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting a post" })
    }

  }
}
