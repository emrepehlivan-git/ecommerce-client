/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * ECommerce API
 * ECommerce API with Keycloak Authentication and Versioning
 * OpenAPI spec version: v1
 */
import {
  useInfiniteQuery,
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  UpdateEmailSettingsCommand
} from '.././model';

import { axiosClientMutator } from '../../../lib/axiosClient';




export const putApiV1ConfigurationEmailSettings = (
    updateEmailSettingsCommand: UpdateEmailSettingsCommand,
 ) => {
      
      
      return axiosClientMutator<void>(
      {url: `/api/v1/Configuration/email-settings`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateEmailSettingsCommand
    },
      );
    }
  


export const getPutApiV1ConfigurationEmailSettingsMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>, TError,{data: UpdateEmailSettingsCommand}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>, TError,{data: UpdateEmailSettingsCommand}, TContext> => {

const mutationKey = ['putApiV1ConfigurationEmailSettings'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>, {data: UpdateEmailSettingsCommand}> = (props) => {
          const {data} = props ?? {};

          return  putApiV1ConfigurationEmailSettings(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV1ConfigurationEmailSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>>
    export type PutApiV1ConfigurationEmailSettingsMutationBody = UpdateEmailSettingsCommand
    export type PutApiV1ConfigurationEmailSettingsMutationError = unknown

    export const usePutApiV1ConfigurationEmailSettings = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>, TError,{data: UpdateEmailSettingsCommand}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV1ConfigurationEmailSettings>>,
        TError,
        {data: UpdateEmailSettingsCommand},
        TContext
      > => {

      const mutationOptions = getPutApiV1ConfigurationEmailSettingsMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    export const getApiV1ConfigurationEmailSettings = (
    
 signal?: AbortSignal
) => {
      
      
      return axiosClientMutator<void>(
      {url: `/api/v1/Configuration/email-settings`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiV1ConfigurationEmailSettingsQueryKey = () => {
    return [`/api/v1/Configuration/email-settings`] as const;
    }

    
export const getGetApiV1ConfigurationEmailSettingsInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>, TError = unknown>( options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV1ConfigurationEmailSettingsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>> = ({ signal }) => getApiV1ConfigurationEmailSettings(signal);

      

      

   return  { queryKey, queryFn,   staleTime: 10000,  ...queryOptions} as UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV1ConfigurationEmailSettingsInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>
export type GetApiV1ConfigurationEmailSettingsInfiniteQueryError = unknown


export function useGetApiV1ConfigurationEmailSettingsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>, TError = unknown>(
  options: { query:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>,
          TError,
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV1ConfigurationEmailSettingsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>,
          TError,
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV1ConfigurationEmailSettingsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiV1ConfigurationEmailSettingsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV1ConfigurationEmailSettingsInfiniteQueryOptions(options)

  const query = useInfiniteQuery(queryOptions , queryClient) as  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const getGetApiV1ConfigurationEmailSettingsQueryOptions = <TData = Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV1ConfigurationEmailSettingsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>> = ({ signal }) => getApiV1ConfigurationEmailSettings(signal);

      

      

   return  { queryKey, queryFn,   staleTime: 10000,  ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV1ConfigurationEmailSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>>
export type GetApiV1ConfigurationEmailSettingsQueryError = unknown


export function useGetApiV1ConfigurationEmailSettings<TData = Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>,
          TError,
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV1ConfigurationEmailSettings<TData = Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>,
          TError,
          Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV1ConfigurationEmailSettings<TData = Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiV1ConfigurationEmailSettings<TData = Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV1ConfigurationEmailSettings>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV1ConfigurationEmailSettingsQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



