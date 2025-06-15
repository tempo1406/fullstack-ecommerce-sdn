import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("Creating product - Session:", session?.user?.id)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { name, description, price, image, category, stock } = await request.json()

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: "Name, description, and price are required" },
        { status: 400 }
      )
    }

    if (price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      )
    }

    if (stock && stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a positive number" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        category: category || null,
        stock: stock ? parseInt(stock) : 0,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
