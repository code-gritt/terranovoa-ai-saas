import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPreview() {
  const articles = [
    {
      title: "10 Ways to Boost Your Team's Productivity",
      excerpt: "Discover proven strategies to enhance your team's efficiency and output without burning out.",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop",
      category: "Productivity",
      date: "Apr 15, 2024",
      readTime: "5 min read",
    },
    {
      title: "The Future of Remote Work: Trends to Watch",
      excerpt: "Explore emerging trends that are shaping how teams collaborate and work together remotely.",
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop",
      category: "Remote Work",
      date: "Apr 10, 2024",
      readTime: "7 min read",
    },
    {
      title: "Building a Data-Driven Culture in Your Organization",
      excerpt: "Learn how to foster a culture where decisions are backed by data and insights.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      category: "Analytics",
      date: "Apr 5, 2024",
      readTime: "6 min read",
    },
  ]

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      <div className="container relative px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-purple-400 font-medium mb-2">Latest Articles</p>
            <h2 className="text-3xl md:text-4xl font-bold">From Our Blog</h2>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto flex items-center gap-1">
              View all articles <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link href="#" key={index} className="group">
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-purple-600/90 text-white text-xs font-medium px-2 py-1 rounded">
                    {article.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
