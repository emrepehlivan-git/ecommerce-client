module.exports = {
  ecommerce: {
    input: {
      target: "http://localhost:4000/swagger/v1/swagger.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/api/generated",
      schemas: "./src/api/generated/model",
      client: "react-query",
      prettier: true,
      override: {
        mutator: {
          path: "./src/lib/axiosClient.ts",
          name: "axiosClientMutator",
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "page",
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
};
