const testimonials = [
  {
    id: "1",
    name: "Sarah M.",
    role: "Wedding Gift",
    content:
      "I turned my sister's wedding photo into a 3D diorama and she cried happy tears! The layers and depth are incredible. Worth every penny.",
    rating: 5,
  },
  {
    id: "2",
    name: "James K.",
    role: "Pet Memorial",
    content:
      "Lost my golden retriever last year. PhotoPrint created the most beautiful memorial sculpture from my favorite photo. It sits on my desk and brings me joy every day.",
    rating: 5,
  },
  {
    id: "3",
    name: "Maria L.",
    role: "Travel Memories",
    content:
      "The landscape panorama of my trip to the Grand Canyon is stunning! The 3D relief captures the depth and scale perfectly. All my friends ask where I got it.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      data-vane-content="testimonials-section"
      data-vane-content-type="social-proof"
      data-vane-content-segment="homepage"
      data-vane-exposure="2000"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-lg text-gray-600">
            See what our customers are saying about their 3D photo prints
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              data-vane-content={`testimonial-${testimonial.id}`}
              data-vane-content-type="testimonial"
              data-vane-content-segment="homepage"
              className="bg-gray-50 rounded-2xl p-8"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
