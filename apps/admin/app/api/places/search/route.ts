import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key is not configured" },
      { status: 500 }
    );
  }

  try {
    // Text Search (New) API を使用
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "ja",
          maxResultCount: 10,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Google Places API error:", error);
      return NextResponse.json(
        { error: "Failed to search places" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // レスポンスを整形
    const results = (data.places || []).map((place: {
      id: string;
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
    }) => ({
      place_id: place.id,
      name: place.displayName?.text || "",
      formatted_address: place.formattedAddress || "",
      geometry: {
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0,
        },
      },
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 }
    );
  }
}
