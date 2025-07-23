import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "TerraNovoa AI has revolutionized our renewable energy project tracking with its stunning geospatial maps and AI insights.",
      author: "Thomas Müller",
      role: "Project Lead, Siemens Energy",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "The automation of our energy data analysis with TerraNovoa AI has boosted our efficiency by over 35%, saving us critical time.",
      author: "Aisha Patel",
      role: "Energy Analyst, Vestas",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "The global support team at TerraNovoa AI is outstanding, providing rapid assistance for our complex geospatial needs.",
      author: "Carlos Rivera",
      role: "Operations Manager, Enel Green Power",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ];

  return (
    <section id="testimonials" className="relative py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

      <div className="container relative px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mb-16 text-lg text-gray-400">
            Don't just take our word for it - hear from some of our satisfied
            customers
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
            >
              <svg
                className="mb-4 h-8 w-8 text-purple-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mb-6 flex-1 text-gray-300">{testimonial.quote}</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
