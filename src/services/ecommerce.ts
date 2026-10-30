export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, image: '/portfolio/project1.svg', category: 'Electronics' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '/portfolio/project2.svg', category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 129.99, image: '/portfolio/project3.svg', category: 'Sports' },
  { id: 4, name: 'Leather Backpack', price: 59.99, image: '/portfolio/project1.svg', category: 'Accessories' },
  { id: 5, name: 'Desk Lamp', price: 39.99, image: '/portfolio/project2.svg', category: 'Home' },
  { id: 6, name: 'Water Bottle', price: 24.99, image: '/portfolio/project3.svg', category: 'Sports' },
]

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}
