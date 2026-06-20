import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import Testimonials from "@/components/ui/Testimonials";
import Newsletter from "@/components/ui/Newsletter";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/lib/products";
import Link from "next/link";

export default function Home() {
  // Show first 3 products as featured
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Hero />
      <Features />

      {/* Featured Products Section */}
      <section
        data-vane-content="featured-products"
        data-vane-content-type="product"
        data-vane-content-segment="homepage"
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Products
            </h2>
            <p className="text-lg text-gray-600">
              Our most loved 3D photo print options
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              data-vane-content-click="view-all-products"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Products
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </>
  );
}
