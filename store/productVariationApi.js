import { base_url } from "@/config/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

// Create API Slice
export const productVariationApi = createApi({
  reducerPath: "productVariationApi",
  baseQuery,
  endpoints: (builder) => ({
    // Change Password API

    getProductVariation: builder.query({
      query: () => ({
        url: "GetQuestions",
        // url: "api/profile/GetUserDataMayfair",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProductVariationQuery } = productVariationApi;
