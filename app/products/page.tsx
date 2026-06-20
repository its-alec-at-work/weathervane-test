import { products } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | PhotoPrint 3D",
  description:
    "Browse our collection of 3D photo print products. Portraits, landscapes, pet sculptures, and custom designs.",
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section
        data-vane-content="products-header"
        data-vane-content-type="navigation"
        data-vane-content-segment="products"
        className="bg-white border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Choose from our range of 3D photo print styles. Each product is
            crafted with precision and care to bring your memories to life.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div
            data-vane-content="products-filter"
            data-vane-content-type="navigation"
            data-vane-content-segment="products"
            className="flex flex-wrap gap-3 mb-8"
          >
            <button
              data-vane-content-click="filter-all"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium"
            >
              All Products
            </button>
            <button
              data-vane-content-click="filter-portrait"
              className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Portraits
            </button>
            <button
              data-vane-content-click="filter-landscape"
              className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Landscapes
            </button>
            <button
              data-vane-content-click="filter-pet"
              className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Pet Sculptures
            </button>
            <button
              data-vane-content-click="filter-custom"
              className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Custom Designs
            </button>
          </div>

          {/* Products */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        data-vane-content="products-cta"
        data-vane-content-type="marketing"
        data-vane-content-segment="products"
        className="bg-indigo-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Something Custom?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            We can create unique 3D prints for special occasions, corporate
            gifts, or any creative vision you have in mind.
          </p>
          <a
            href="/contact"
            data-vane-content-click="products-custom-cta"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Request Custom Quote
          </a>
        </div>
      </section>
    </div>
  );
}
