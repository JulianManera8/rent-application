import { useState, useEffect } from 'react';
import supabase from "../lib/supabase";

export function useFetchBuckets(tableName, selectParam, searchParams) {
  const { col, key } = searchParams || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: filesBucket, error: errorFiles } = await supabase
          .from(tableName)
          .select(selectParam)
          .eq(col, key)
          

        if (errorFiles) {
          throw new Error("Error fetching files from bucket");
        }

        setData(filesBucket);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, error, isLoading };
}
