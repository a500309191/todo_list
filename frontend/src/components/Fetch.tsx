import React, { FC, ReactNode } from "react";
import { useFetch } from "./hooks/useFetch";
import { Loading } from "./Loading";

interface IFetch {
  uri: string
  renderSuccess: any
  loadingFallback?: any
}

const ErrorMessage = (message: any) => {
    return (
        <div className="error-message">
            {JSON.stringify(message.message).toUpperCase()}
        </div>
    )
}

export const Fetch = ({
    uri,
    renderSuccess,
    loadingFallback = <Loading />,
}: IFetch) => {

    const { loading, data, error } = useFetch(uri)

    if (loading) return loadingFallback
    if (error) return <ErrorMessage message={error} />
    if (data) return renderSuccess({data})
}