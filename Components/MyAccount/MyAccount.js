// pages/my-account.js

import React from "react";
import Head from "next/head";
import ProductCard from "@/Components/ProductCard/ProductCard";
import { Skeleton } from "@mui/material";
export async function getStaticProps() {
  return {
    props: {
      title: "About Us - Mayfair",
      description: "This is a static about page.",
    },
  };
}

// Skeleton UI Card
const SkeletonCard = () => (
  <div className="p-4 my-3 bg-white rounded-lg shadow-md">
    <Skeleton variant="rectangular" height={208} className="mb-4 rounded-lg" />
    <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="80%" />
    <Skeleton variant="text" sx={{ fontSize: "0.875rem" }} width="60%" />
    <Skeleton variant="rectangular" height={40} className="mt-4 rounded-md" />
  </div>
);

const MyAccount = ({ data }) => {
  const isLoading = !data;
  console.log(data, "sadsadsda")
  return (
    <>
      <Head>
        <title>My Account - Treatments | Mayfair Clinic</title>
        <meta name="description" content="View available and reorder weight loss treatments from Mayfair Weight Loss Clinic." />
        <meta name="keywords" content="weight loss, treatments, reorder, Mayfair Clinic, injections" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="My Account - Mayfair Weight Loss Clinic" />
        <meta property="og:description" content="Manage and reorder your treatments online with ease." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mayfairweightlossclinic.co.uk/my-account" />
        <meta property="og:image" content="/images/meta-image.jpg" />
      </Head>

      <div className="p-5 sm:p-10 sm:bg-gray-50 sm:min-h-screen sm:rounded-lg sm:shadow-md my-5">

        {/* ✨ Reorder Section */}
        {!data && <p className="text-red-500">❌ Failed to load data.</p>}
        {data?.reorder && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Reorder Treatment</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(data.reorder) ? (
                data.reorder.map((product, index) => (
                  <ProductCard
                    key={product?.id || index}
                    id={product?.id}
                    title={product?.name}
                    image={product?.img}
                    price={product?.price || "N/A"}
                    status={product?.inventories?.[0]?.status}
                    buttonText="Reorder Consultation"
                    reorder
                  />
                ))
              ) : (
                <ProductCard
                  id={data.reorder.id}
                  title={data.reorder.name}
                  image={data.reorder.img}
                  price={data.reorder.price || "N/A"}
                  status={data.reorder.inventories?.[0]?.status}
                  lastOrderDate={data.reorder.lastOrderDate}
                  buttonText="Reorder Consultation"
                  reorder
                />
              )}
            </div>
          </div>
        )}

        {/* ✨ Available Products */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : data?.products?.length > 0 ? (
          <>
            <header className="pb-9">
              <h1 className="text-2xl font-semibold text-gray-900">Available Treatments</h1>
              <p className="text-gray-600 text-sm mt-2">
                We offer the following weight loss injections treatment options to help you in your weight loss journey...
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products
                .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    image={product.img}
                    price={product.price || "N/A"}
                    status={product.inventories?.[0]?.status}
                    buttonText="Start Consultation"
                    reorder={false}
                  />
                ))}
            </div>
          </>
        ) : (
          <p className="text-yellow-500">⚠️ No products found.</p>
        )}
      </div>
    </>
  );
};

export default MyAccount;


