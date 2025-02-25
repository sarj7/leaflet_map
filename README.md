# Interactive Geodesic Distance Calculator with Leaflet

A Next.js application that demonstrates interactive map functionality using Leaflet. The application allows users to calculate geodesic distances between two points on Earth, plot great circle paths, and switch between different map styles.

## Features

- Interactive map with multiple base layer options:
  - OpenStreetMap Standard
  - OpenStreetMap Humanitarian
  - OpenStreetMap Cycling
  - OpenStreetMap Transport
  - Satellite Imagery
  - Terrain View
  - Topographic Map
  - Dark Matter Theme
  - Watercolor Style
- Click-to-plot markers for start and end points
- Automatic calculation of geodesic distance between markers
- Visualization of great circle path between points
- Responsive design with full-screen map
- Real-time distance display in kilometers

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.x or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leaflet-map-app
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. The map loads with a default center position and zoom level
2. Click anywhere on the map to place your first marker (start point)
3. Click a second location to place the end point marker
4. The application will automatically:
   - Draw a geodesic line (great circle) between the points
   - Calculate and display the distance in kilometers
5. Click again to reset the markers and start a new measurement
6. Use the layer control in the top-right corner to switch between different map styles

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps
- [Turf.js](https://turfjs.org/) - Geospatial analysis
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Project Structure

```
leaflet-map-app/
├── src/
│   └── app/
│       ├── components/
│       │   └── LeafletMap.tsx    # Main map component
│       ├── layout.tsx
│       └── page.tsx              # Main page component
├── public/                       # Static assets
├── package.json
└── README.md
```

## Key Dependencies

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "@turf/turf": "^6.5.0"
  }
}
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Map tiles provided by OpenStreetMap and various contributors
- Geodesic calculations powered by Turf.js
- Map interface built with Leaflet