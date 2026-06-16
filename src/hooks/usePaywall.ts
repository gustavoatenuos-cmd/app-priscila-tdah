import { useState, useEffect } from "react";

export function usePaywall(featureName: string) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/subscription/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          if (!data.has_access) setShowPaywall(true);
        } else {
          setShowPaywall(true);
        }
      } catch (e) {
        console.error("Error fetching subscription status", e);
        setShowPaywall(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const checkAccess = async (): Promise<boolean> => {
    if (loading) return false;
    if (!status) return false;
    return Boolean(status.has_access);
  };

  return { showPaywall, setShowPaywall, checkAccess, status };
}
