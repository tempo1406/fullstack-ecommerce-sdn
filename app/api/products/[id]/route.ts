import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: id
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

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params;
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: id
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this product" },
        { status: 403 }
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
    }    const updatedProduct = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        category: category || null,
        stock: stock ? parseInt(stock) : 0,
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

    return NextResponse.json(updatedProduct)

  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (authenticated, owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params;
    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: id
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this product" },
        { status: 403 }
      )
    }    await prisma.product.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
