import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gpAddressApi = createApi({
  reducerPath: "gpAddressApi", // Unique path for the reducer
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // Base URL for the API
  endpoints: (builder) => ({
    fetchAddresses: builder.query({
      queryFn: async (postalCode, _api, _extraOptions, baseQuery) => {
        const apiUrl = `https://api.nhs.uk/service-search/search-postcode-or-place?api-version=1&search=${postalCode}`;
        const apiKey = "7a46f2abc01b47b58e586ec1cda38c68"; // Replace with your API key

        try {
          // Perform the POST request
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "subscription-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filter: "(OrganisationTypeID eq 'GPB') or (OrganisationTypeID eq 'GPP')",
              top: 25,
              skip: 0,
              count: true,
            }),
          });

          if (!response.ok) {
            return { error: { status: response.status, message: "Failed to fetch addresses" } };
          }

          const data = await response.json();

          if (data && data.services) {
            return { data: data.services }; // Return services as data
          } else {
            return { error: { status: "NO_DATA", message: "No services found" } };
          }
        } catch (error) {
          return { error: { status: "FETCH_ERROR", message: "API Error" } };
        }
      },
    }),
  }),
});

// Export hooks for using the query
export const { useFetchAddressesQuery } = gpAddressApi;
