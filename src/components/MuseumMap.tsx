import { useEffect, useState } from 'react';
import { Collection } from '../lib/supabase';
import { MapPin } from 'lucide-react';

interface MuseumMapProps {
  collections: Collection[];
  onSelectCollection: (slug: string) => void;
}

export default function MuseumMap({ collections, onSelectCollection }: MuseumMapProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const rooms = [
    { id: 'artisanat', x: 150, y: 100, width: 180, height: 140, label: 'Artisanat' },
    { id: 'costumes', x: 370, y: 100, width: 180, height: 140, label: 'Costumes' },
    { id: 'musique', x: 590, y: 100, width: 180, height: 140, label: 'Musique' },
    { id: 'architecture', x: 260, y: 280, width: 180, height: 140, label: 'Architecture' },
    { id: 'rituels', x: 480, y: 280, width: 180, height: 140, label: 'Rituels' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Plan du Musée
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cliquez sur une salle pour la visiter
        </p>
      </div>

      <svg
        viewBox="0 0 900 500"
        className="w-full h-auto"
        style={{ maxHeight: '500px' }}
      >
        <rect
          x="100"
          y="50"
          width="700"
          height="400"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-300 dark:text-gray-600"
        />

        <line
          x1="450"
          y1="450"
          x2="450"
          y2="480"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-400 dark:text-gray-600"
        />
        <rect
          x="420"
          y="480"
          width="60"
          height="10"
          fill="currentColor"
          className="text-gray-400 dark:text-gray-600"
        />
        <text
          x="450"
          y="498"
          textAnchor="middle"
          className="text-xs fill-gray-600 dark:fill-gray-400"
        >
          Entrée
        </text>

        {rooms.map((room) => {
          const isHovered = hoveredRoom === room.id;
          const collection = collections.find((c) => c.slug === room.id);

          return (
            <g key={room.id}>
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                stroke="currentColor"
                strokeWidth="2"
                className={`cursor-pointer transition-all stroke-gray-400 dark:stroke-gray-500 ${
                  isHovered
                    ? 'fill-amber-200 dark:fill-amber-700'
                    : 'fill-gray-100 dark:fill-gray-700'
                }`}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => collection && onSelectCollection(collection.slug)}
              />

              <circle
                cx={room.x + room.width / 2}
                cy={room.y + 40}
                r="20"
                fill="currentColor"
                className={`${
                  isHovered
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-amber-500 dark:text-amber-600'
                }`}
              />

              <text
                x={room.x + room.width / 2}
                y={room.y + 46}
                textAnchor="middle"
                className="text-2xl fill-white pointer-events-none"
              >
                {room.label.charAt(0)}
              </text>

              <text
                x={room.x + room.width / 2}
                y={room.y + 90}
                textAnchor="middle"
                className={`text-sm font-semibold pointer-events-none ${
                  isHovered
                    ? 'fill-gray-900 dark:fill-white'
                    : 'fill-gray-700 dark:fill-gray-300'
                }`}
              >
                {room.label}
              </text>

              {collection && (
                <text
                  x={room.x + room.width / 2}
                  y={room.y + 110}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400 pointer-events-none"
                >
                  {room.label === 'Architecture' ? 'Sacrée' : 'Traditionnel'}
                </text>
              )}

              <rect
                x={room.x + room.width / 2 - 30}
                y={room.y + room.height - 10}
                width="60"
                height="8"
                fill="currentColor"
                className="text-gray-400 dark:text-gray-600"
              />
            </g>
          );
        })}

        <path
          d="M 450 430 L 260 240 M 450 430 L 370 240 M 450 430 L 480 240 M 450 430 L 590 240 M 450 430 L 680 240"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5,5"
          className="text-gray-300 dark:text-gray-600"
          opacity="0.5"
        />
      </svg>

      {hoveredRoom && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {collections.find((c) => c.slug === hoveredRoom)?.name}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {collections.find((c) => c.slug === hoveredRoom)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
