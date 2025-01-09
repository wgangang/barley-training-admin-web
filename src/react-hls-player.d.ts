declare module 'react-hls-player' {
    import React from 'react';
    
    interface ReactHlsPlayerProps {
      src: string;
      autoPlay?: boolean;
      controls?: boolean;
      width?: string | number;
      height?: string | number;
      [key: string]: any;
    }
  
    const ReactHlsPlayer: React.FC<ReactHlsPlayerProps>;
    export default ReactHlsPlayer;
  }