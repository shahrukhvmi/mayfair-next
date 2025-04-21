import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token; // Extracting token from state
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
                url: "api/products/GetProducts",
                method: "GET",
                body: data,
            }),
            providesTags: ["Products"],
        }),
        // Change Password API
        changePassword: builder.mutation({
            query: (data) => ({
                url: "api/password/ChangePassword",
                method: "POST",
                body: data,
            }),
        }),
        userUpdate: builder.mutation({
            query: (data) => ({
                url: "api/profile/UpdateUserData",
                method: "POST",
                body: data,
            }),
        }),
        getOrdersData: builder.query({
            query: (data) => ({
                url: "api/order/myorders",
                method: "GET",
                body: data,
            }),
        }),
        getViewOrder: builder.query({
            query: (data) => ({
                url: `api/order/ViewOrder/${data?.id}`,
                method: "GET",
            }),
        }),

        profileUserData: builder.query({
            query: () => ({
                url: "api/profile/GetUserData",
                // url: "api/profile/GetUserDataMayfair",
                method: "GET",
            }),
            providesTags: ["UserProfile"],
        }),

        inStockNotified: builder.mutation({
            query: (data) => ({
                url: "api/GetNotified",
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
