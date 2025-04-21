import React from "react";
import ProductCard from "../../ProductCard/ProductCard";
import { useGetProductsQuery } from "../../../store/services/Dashboard/dashboardApi";
import { Skeleton } from "@mui/material";

const SkeletonCard = () => (
  <div className="p-4 my-3 bg-white rounded-lg shadow-md">
    <Skeleton variant="rectangular" height={208} className="mb-4 rounded-lg" />

    <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="80%" />

    <Skeleton variant="text" sx={{ fontSize: "0.875rem" }} width="60%" />

    <Skeleton variant="rectangular" height={40} className="mt-4 rounded-md" />


  </div>
);


const MyAccount = () => {
  const { data, error, isLoading } = useGetProductsQuery();


  console.log(data?.data?.reorder?.inventories,"statuasadsdss")
  return (
    <div className="p-5 sm:p-10 sm:bg-gray-50 sm:min-h-screen sm:rounded-lg sm:shadow-md my-5">
      {/* ✅ Reorder Treatment Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : data?.data?.reorder && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Reorder Treatment</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.reorder ? (
              !Array.isArray(data.data.reorder) ? (
                <ProductCard
                  id={data?.data?.reorder?.id}
                  title={data?.data?.reorder?.name}
                  image={data?.data?.reorder?.img}
                  price={data?.data?.reorder?.price || "N/A"}
                  status={data?.data?.reorder?.inventories?.[0]?.status}
                  lastOrderDate={data?.data?.reorder?.lastOrderDate}
                  buttonText={"Reorder Consultation"}
                  reorder={true}
                />
              ) : (
                data?.data?.reorder.map((product, index) => (
                  <ProductCard
                    key={product?.id || index}
                    id={product?.id}
                    title={product?.name}
                    image={product?.img}
                    price={product?.price || "N/A"}
                    status={data?.data?.reorder?.inventories?.[0]?.status}
                    buttonText={"Reorder Consultation"}
                    reorder={true}
                  />
                ))
              )
            ) : (
              <p className="text-start reg-font text-sm text-gray-600">
                No reorder treatments available.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Available Treatments Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : data?.data?.products && (
        <>
          <header className="pb-9">
            <h1 className=" text-2xl text-left font-semibold text-gray-900">
              Available Treatments
            </h1>
            <p className="text-gray-600 text-left text-sm leading-relaxed xl:w-3/4 mt-2 ">
            We offer the following weight loss injections treatment options to help you in your weight loss journey. You can request weight loss injections online at Mayfair Weight Loss Clinic. All treatment options are subject to approval by our UK-registered prescribers following the completion and assessment of the medical consultation form. View the weight loss treatment options below for more information. </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.products?.length > 0 ? (
              [...data.data.products]
                .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) // sort by sequence
                .map((product) => (
                  <ProductCard
                    key={product?.id || product?.sequence}
                    id={product?.id}
                    title={product?.name}
                    image={product?.img}
                    price={product?.price || "N/A"}
                    status={product?.inventories?.[0]?.status}
                    buttonText={"Start Consultation"}
                    reorder={false}
                  />
                ))
            ) : (
              <p className="text-start reg-font text-sm text-gray-600">
                No available treatments at the moment.
              </p>
            )}
          </div>

        </>
      )}
    </div>
  );
};

export default MyAccount;
