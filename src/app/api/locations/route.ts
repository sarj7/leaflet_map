import { NextResponse } from 'next/server';

export async function GET() {
    // Example default locations
    const locations = {
        locations: [
            [51.5074, -0.1278], // London
            [40.7128, -74.0060], // New York
        ]
    };

    return NextResponse.json(locations);
}
