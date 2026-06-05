"use client";


export default function ContactPage() {
  return (
    <div className="min-h-screen px-6 py-20 bg-white">
      
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Contact
      </h1>

      <p className="text-gray-600 mb-8 max-w-xl">
        You can reach us using the information below.
      </p>

      <div className="space-y-4 text-lg text-gray-700">
        <p>
          <span className="font-medium">Phone:</span>{" "}
          +212 6 12 34 56 78
        </p>

        <p>
          <span className="font-medium">Location:</span>{" "}
          Casablanca, Morocco
        </p>
      </div>

    </div>
  );
}



