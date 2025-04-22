import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "@/config/constant";

const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  prepareHeaders: (headers, { getState }) => {
    // const token = getState().auth.token; 
    const token = "5359|PbvxAw7AaLUOx5G4aQIW12n7Tma3HBfE6xyufX9h7e012f8e*89JB"
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Setting Authorization header
    }
    return headers;
  },
});

// Create API Slice
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: "/products/GetAllProducts",
        method: "GET",
        body: data,
      }),
      providesTags: ["Products"],
    }),
    // Change Password API
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/password/ChangePassword",
        method: "POST",
        body: data,
      }),
    }),
    userUpdate: builder.mutation({
      query: (data) => ({
        url: "/profile/UpdateUserData",
        method: "POST",
        body: data,
      }),
    }),
    getOrdersData: builder.query({
      query: (data) => ({
        url: "/order/myorders",
        method: "GET",
        body: data,
      }),
    }),
    getViewOrder: builder.query({
      query: (data) => ({
        url: `/order/ViewOrder/${data?.id}`,
        method: "GET",
      }),
    }),

    profileUserData: builder.query({
      query: () => ({
        url: "/profile/GetUserData",
        // url: "api/profile/GetUserDataMayfair",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    inStockNotified: builder.mutation({
      query: (data) => ({
        url: "/GetNotified",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useChangePasswordMutation,
  useUserUpdateMutation,
  useGetOrdersDataQuery,
  useGetViewOrderQuery,
  useProfileUserDataQuery,
  useInStockNotifiedMutation,
} = dashboardApi;
