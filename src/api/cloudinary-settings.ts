import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { axiosClientMutator } from '../lib/axiosClient';
import type {
  CloudinarySettings,
  UpdateCloudinarySettingsCommand,
  TestCloudinaryConnectionRequest,
  TestCloudinaryConnectionResponse,
} from '../types/cloudinary';

// Get Cloudinary Settings
export const getApiV1ConfigurationCloudinarySettings = (signal?: AbortSignal) => {
  return axiosClientMutator<CloudinarySettings>({
    url: `/api/v1/Configuration/cloudinary-settings`,
    method: 'GET',
    signal,
  });
};

export const getGetApiV1ConfigurationCloudinarySettingsQueryKey = () => {
  return [`/api/v1/Configuration/cloudinary-settings`] as const;
};

export const getGetApiV1ConfigurationCloudinarySettingsQueryOptions = <
  TData = CloudinarySettings,
  TError = unknown
>(
  options?: {
    query?: Partial<UseQueryOptions<CloudinarySettings, TError, TData>>;
  }
) => {
  const { query: queryOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetApiV1ConfigurationCloudinarySettingsQueryKey();

  const queryFn = ({ signal }: { signal?: AbortSignal }) =>
    getApiV1ConfigurationCloudinarySettings(signal);

  return {
    queryKey,
    queryFn,
    staleTime: 10000,
    ...queryOptions,
  } as UseQueryOptions<CloudinarySettings, TError, TData>;
};

export function useGetApiV1ConfigurationCloudinarySettings<
  TData = CloudinarySettings,
  TError = unknown
>(
  options?: {
    query?: Partial<UseQueryOptions<CloudinarySettings, TError, TData>>;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> {
  const queryOptions = getGetApiV1ConfigurationCloudinarySettingsQueryOptions(options);
  return useQuery(queryOptions, queryClient);
}

// Update Cloudinary Settings
export const putApiV1ConfigurationCloudinarySettings = (
  updateCloudinarySettingsCommand: UpdateCloudinarySettingsCommand
) => {
  return axiosClientMutator<void>({
    url: `/api/v1/Configuration/cloudinary-settings`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: updateCloudinarySettingsCommand,
  });
};

export const getPutApiV1ConfigurationCloudinarySettingsMutationOptions = <
  TError = unknown,
  TContext = unknown
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof putApiV1ConfigurationCloudinarySettings>>,
      TError,
      { data: UpdateCloudinarySettingsCommand },
      TContext
    >;
  }
): UseMutationOptions<
  Awaited<ReturnType<typeof putApiV1ConfigurationCloudinarySettings>>,
  TError,
  { data: UpdateCloudinarySettingsCommand },
  TContext
> => {
  const mutationKey = ['putApiV1ConfigurationCloudinarySettings'];
  const { mutation: mutationOptions } = options ?? { mutation: { mutationKey } };

  const mutationFn = (props: { data: UpdateCloudinarySettingsCommand }) => {
    const { data } = props ?? {};
    return putApiV1ConfigurationCloudinarySettings(data);
  };

  return { mutationFn, ...mutationOptions };
};

export const usePutApiV1ConfigurationCloudinarySettings = <
  TError = unknown,
  TContext = unknown
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof putApiV1ConfigurationCloudinarySettings>>,
      TError,
      { data: UpdateCloudinarySettingsCommand },
      TContext
    >;
  },
  queryClient?: QueryClient
): UseMutationResult<
  Awaited<ReturnType<typeof putApiV1ConfigurationCloudinarySettings>>,
  TError,
  { data: UpdateCloudinarySettingsCommand },
  TContext
> => {
  const mutationOptions = getPutApiV1ConfigurationCloudinarySettingsMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
};

// Test Cloudinary Connection
export const postApiV1ConfigurationTestCloudinary = (
  testCloudinaryRequest: TestCloudinaryConnectionRequest
) => {
  return axiosClientMutator<TestCloudinaryConnectionResponse>({
    url: `/api/v1/Configuration/test-cloudinary`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: testCloudinaryRequest,
  });
};

export const getPostApiV1ConfigurationTestCloudinaryMutationOptions = <
  TError = unknown,
  TContext = unknown
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postApiV1ConfigurationTestCloudinary>>,
      TError,
      { data: TestCloudinaryConnectionRequest },
      TContext
    >;
  }
): UseMutationOptions<
  Awaited<ReturnType<typeof postApiV1ConfigurationTestCloudinary>>,
  TError,
  { data: TestCloudinaryConnectionRequest },
  TContext
> => {
  const mutationKey = ['postApiV1ConfigurationTestCloudinary'];
  const { mutation: mutationOptions } = options ?? { mutation: { mutationKey } };

  const mutationFn = (props: { data: TestCloudinaryConnectionRequest }) => {
    const { data } = props ?? {};
    return postApiV1ConfigurationTestCloudinary(data);
  };

  return { mutationFn, ...mutationOptions };
};

export const usePostApiV1ConfigurationTestCloudinary = <
  TError = unknown,
  TContext = unknown
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postApiV1ConfigurationTestCloudinary>>,
      TError,
      { data: TestCloudinaryConnectionRequest },
      TContext
    >;
  },
  queryClient?: QueryClient
): UseMutationResult<
  Awaited<ReturnType<typeof postApiV1ConfigurationTestCloudinary>>,
  TError,
  { data: TestCloudinaryConnectionRequest },
  TContext
> => {
  const mutationOptions = getPostApiV1ConfigurationTestCloudinaryMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
};