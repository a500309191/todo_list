import { useState, useEffect } from 'react'

export const useFetch = (uri: string) => {

    const [data, setData] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!uri) return

        fetch(uri)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                setData(result)
            })
            .then(() => setLoading(false))
            .catch(setError)
    }, [uri])

    return {loading, data, error}
}
