import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(124, 58, 237, 0.15) 2px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="container relative px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl"></div>
            
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>

            <div className="relative text-center mb-10">
              <span className="inline-block px-3 py-1 text-xs font-medium text-purple-400 bg-purple-900/30 rounded-full mb-3">Newsletter</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stay Updated with SaasPro</h2>
              <p className="text-gray-300 max-w-lg mx-auto">
                Subscribe to our newsletter for the latest updates, tips, and exclusive offers delivered directly to your inbox.
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white h-12 rounded-lg"
                />
              </div>
              <Button className="h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Subscribe Now
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
