declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, CSSProperties } from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }
  export const ComposableMap: ComponentType<ComposableMapProps>;

  export interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (args: { geographies: Geography[] }) => ReactNode;
  }
  export const Geographies: ComponentType<GeographiesProps>;

  export interface Geography {
    rsmKey: string;
    [key: string]: unknown;
  }

  export interface GeographyProps {
    geography: Geography;
    style?: {
      default?: CSSProperties & { outline?: string };
      hover?: CSSProperties & { outline?: string };
      pressed?: CSSProperties & { outline?: string };
    };
    className?: string;
  }
  export const Geography: ComponentType<GeographyProps>;

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }
  export const Marker: ComponentType<MarkerProps>;
}
