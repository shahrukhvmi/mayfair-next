import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Client from "getaddress-api"; // Import the address client

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    fetchAddresses: builder.query({
      queryFn: async (postalCode, _api, _extraOptions, baseQuery) => {
        const apiKey = "_UFb05P76EyMidU1VHIQ_A42976";
        const api = new Client(apiKey);

        try {
          const response = await api.find(postalCode);

          if (response.isSuccess) {
            return { data: response.addresses };
          } else {
            return { error: { status: "CUSTOM_ERROR", message: "Invalid Postal Code" } };
          }
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: "API Error" } };
        }
      },
    }),


    fetchAddressesForBilling: builder.query({
      queryFn: async (postalCode, _api, _extraOptions, baseQuery) => {
        const apiKey = "_UFb05P76EyMidU1VHIQ_A42976";
        const api = new Client(apiKey);

        try {
          const response = await api.find(postalCode);

          if (response.isSuccess) {
            return { data: response.addresses };
          } else {
            return { error: { status: "CUSTOM_ERROR", message: "Invalid Postal Code" } };
          }
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: "API Error" } };
        }
      },
    }),
  }),
});

// Export hooks for using queries
export const { useFetchAddressesQuery, useFetchAddressesForBillingQuery } = addressApi;
