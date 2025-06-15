import axios from "axios";

/**
 * Check if the API server is available
 * @returns Promise<{available: boolean, message: string}> Availability status and message
 */
export async function checkApiAvailability(): Promise<{
    available: boolean;
    message: string;
}> {
    // Get API URL from environment variable or use default
    const apiUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

    console.log("Checking API availability at:", apiUrl);

    // Try multiple approaches to connect to the API
    try {
        // 1. First try the direct path with common settings
        try {
            const response = await axios.get(`${apiUrl}/products`, {
                timeout: 5000,
                withCredentials: false,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return {
                available: true,
                message: `API available at ${apiUrl}, status: ${response.status}`,
            };
        } catch (firstError) {
            console.log("First connection attempt failed:", firstError);

            // 2. If that fails and URL ends with /api, try without it
            if (apiUrl.endsWith("/api")) {
                try {
                    const baseUrl = apiUrl.slice(0, -4); // Remove /api
                    console.log("Trying without /api:", baseUrl);

                    await axios.get(`${baseUrl}/products`, {
                        timeout: 5000,
                        withCredentials: false,
                    });

                    // If this works, suggest updating the API URL
                    return {
                        available: true,
                        message: `API available at ${baseUrl} (without /api suffix). Consider updating your NEXT_PUBLIC_BACKEND_URL`,
                    };
                } catch (secondError) {
                    console.log("Second attempt also failed:", secondError);
                    // Continue with more attempts
                }
            }

            // 3. Try with different port (3001 is common alternative)
            try {
                const altPort = apiUrl.replace(":3000", ":3001");
                console.log("Trying alternative port:", altPort);

                await axios.get(`${altPort}/products`, {
                    timeout: 5000,
                    withCredentials: false,
                });

                return {
                    available: true,
                    message: `API available at ${altPort}. Consider updating your NEXT_PUBLIC_BACKEND_URL`,
                };
            } catch (thirdError) {
                console.log("Third attempt also failed:", thirdError);
                // Continue to error handling
                throw firstError; // Throw the original error for the error handler below
            }
        }
    } catch (error) {
        let message = "API connection check failed";

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                message = `API responded with error: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                // The request was made but no response was received
                message =
                    "No response received from API server. Check if server is running.";
            } else {
                // Something happened in setting up the request
                message = `API request setup error: ${error.message}`;
            }

            if (error.code === "ECONNABORTED") {
                message =
                    "API request timed out. Server may be slow or unreachable.";
            }

            // Check for CORS issues (often seen with network errors and specific messages)
            if (error.message.includes("Network Error")) {
                message =
                    "Network Error: Possible causes include CORS issues, server not running, or incorrect API URL. Check that your backend server is running and has proper CORS configuration.";
            }
        } else {
            message = `Unknown error: ${String(error)}`;
        }

        console.error(message, error);
        return { available: false, message };
    }
}

// Store API status information (for sharing across components)
let apiAvailabilityCache: {
    available: boolean | null;
    message: string;
    lastChecked: number;
} = {
    available: null, // null = not checked yet
    message: "",
    lastChecked: 0,
};

/**
 * Get API availability status with caching
 * Won't check more than once per minute to avoid excessive requests
 */
export async function getApiStatus(): Promise<{
    available: boolean;
    message: string;
}> {
    const now = Date.now();
    const cacheTimeLimit = 30 * 1000; // 30 seconds (reduced from 60s for debugging)

    // If we've checked recently, return the cached result
    if (
        apiAvailabilityCache.available !== null &&
        now - apiAvailabilityCache.lastChecked < cacheTimeLimit
    ) {
        return {
            available: apiAvailabilityCache.available,
            message: apiAvailabilityCache.message,
        };
    }

    // Otherwise check and update cache
    const result = await checkApiAvailability();
    apiAvailabilityCache = {
        available: result.available,
        message: result.message,
        lastChecked: now,
    };

    return result;
}

/**
 * Updates the API availability cache (used when an API call fails/succeeds)
 */
export function updateApiStatusCache(available: boolean): void {
    apiAvailabilityCache = {
        available,
        message: available ? "API is available" : "API is unavailable",
        lastChecked: Date.now(),
    };
}
