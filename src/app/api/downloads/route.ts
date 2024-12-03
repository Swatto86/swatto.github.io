import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for utility names
const utilitySchema = z.enum([
  "PSTInsight",
  "ConnectX",
  "ChecksumCheck",
  "EventSleuth",
  "BitBurn",
]);
type UtilityName = z.infer<typeof utilitySchema>;

// Request validation schema
const incrementRequestSchema = z.object({
  utility: utilitySchema,
});

// Error handling utility
const createErrorResponse = (error: unknown, status: number = 500) => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const errorDetails =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : "Unknown error";

  console.error("Error in download handler:", {
    error: errorDetails,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      error: errorMessage,
      success: false,
      details: errorMessage,
    },
    {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
};

// Utility function to validate KV instance
const validateKV = () => {
  if (!kv) {
    throw new Error(
      "@vercel/kv: Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN"
    );
  }
};

// Get download count for a utility
const getDownloadCount = async (utility: UtilityName): Promise<number> => {
  validateKV();
  const key = `downloadCount:${utility}`;
  const count = await kv.get<number>(key);

  console.log("Retrieved download count:", {
    utility,
    count: count ?? 0,
    timestamp: new Date().toISOString(),
  });

  return count ?? 0;
};

// Increment download count for a utility
const incrementDownloadCount = async (
  utility: UtilityName
): Promise<number> => {
  validateKV();
  const key = `downloadCount:${utility}`;

  console.log("Attempting to increment counter for:", {
    utility,
    key,
    timestamp: new Date().toISOString(),
  });

  const newCount = await kv.incr(key);

  if (typeof newCount !== "number") {
    throw new Error("Counter operation failed: Invalid increment result");
  }

  console.log("Download count incremented successfully:", {
    utility,
    newCount,
    timestamp: new Date().toISOString(),
  });

  return newCount;
};

export async function POST(request: Request) {
  try {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = incrementRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return createErrorResponse(new Error("Invalid utility name"), 400);
    }

    const { utility } = validationResult.data;
    const newCount = await incrementDownloadCount(utility);

    return NextResponse.json(
      {
        count: newCount,
        utility,
        success: true,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("@vercel/kv")) {
      return NextResponse.json(
        {
          error: error.message,
          success: false,
          details: error.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }
    return createErrorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const utility = searchParams.get("utility");

    // Validate utility parameter
    const validationResult = utilitySchema.safeParse(utility);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return createErrorResponse(new Error("Invalid utility name"), 400);
    }

    const count = await getDownloadCount(validationResult.data);

    return NextResponse.json(
      {
        count,
        utility: validationResult.data,
        success: true,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("@vercel/kv")) {
      return NextResponse.json(
        {
          error: error.message,
          success: false,
          details: error.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }
    return createErrorResponse(error);
  }
}
