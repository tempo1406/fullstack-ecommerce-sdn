import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin1@example.com' },
    update: {},
    create: {
      email: 'admin1@example.com',
      password: hashedPassword,
      name: 'Admin1',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'admin2@example.com' },
    update: {},
    create: {
      email: 'admin2@example.com',
      password: hashedPassword,
      name: 'Admin2',
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Classic White T-Shirt',
      description: 'Premium cotton t-shirt perfect for everyday wear. Soft, comfortable, and durable.',
      price: 29.99,
      category: 'clothing',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      userId: user1.id,
    },
    {
      name: 'Denim Jacket',
      description: 'Vintage-style denim jacket with a modern fit. Perfect for layering.',
      price: 89.99,
      category: 'clothing',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&h=500&fit=crop',
      userId: user1.id,
    },
    {
      name: 'Running Sneakers',
      description: 'Lightweight running shoes with superior comfort and support.',
      price: 129.99,
      category: 'shoes',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      userId: user2.id,
    },
    {
      name: 'Leather Handbag',
      description: 'Elegant leather handbag perfect for work or casual outings.',
      price: 199.99,
      category: 'accessories',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      userId: user2.id,
    },
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 159.99,
      category: 'electronics',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      userId: user1.id,
    },
    {
      name: 'Summer Dress',
      description: 'Flowy summer dress perfect for warm weather and special occasions.',
      price: 79.99,
      category: 'clothing',
      stock: 18,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',
      userId: user2.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { 
        // Use a combination of name and userId for uniqueness
        name_userId: {
          name: product.name,
          userId: product.userId
        }
      },
      update: {},
      create: product,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('📧 Sample users created:')
  console.log('   - john@example.com (password: password123)')
  console.log('   - jane@example.com (password: password123)')
  console.log('🛍️ Sample products created: 6 items')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
