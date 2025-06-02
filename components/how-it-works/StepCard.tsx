import Image from "next/image"

interface StepCardProps {
  step: {
    number: string
    title: string
    description: string
    color: string
    image: string
  }
}

export default function StepCard({ step }: StepCardProps) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1 transition-all duration-300">
      {/* Image at top */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={step.image || "/placeholder.svg"}
          alt={step.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        {/* Step number overlay */}
        <div className="absolute top-3 right-3 bg-gray-900/70 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center border border-gray-700">
          <span className="text-sm font-bold">{step.number}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {step.title}
        </h3>
        <p className="text-gray-400 text-sm">
          {step.description}
        </p>
      </div>
    </div>
  )
}
