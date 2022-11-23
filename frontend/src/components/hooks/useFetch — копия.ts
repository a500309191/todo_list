import { useState, useEffect } from 'react'
import axios, { AxiosError } from "axios"

export const useFetch = (uri: string) => {

    const [data, setData] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async (uri: string) => {
        try {
            setError("")
            setLoading(true)
            const response = await axios.get(uri)
            setData(response.data)
            setLoading(false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    useEffect(() => {
        fetchData(uri)
    }, [uri])

    return {loading, data, error}
}
