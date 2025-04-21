import { base_url } from "@/config/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

// Create API Slice
export const questionsApi = createApi({
  reducerPath: "questionsApi",
  baseQuery,
  endpoints: (builder) => ({
    // Change Password API

    getQuestions: builder.query({
      query: () => ({
        url: "GetQuestions",
        // url: "api/profile/GetUserDataMayfair",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetQuestionsQuery } = questionsApi;
