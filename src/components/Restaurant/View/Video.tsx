import React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { RestaurantDataType } from '../../../types/restaurant';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

type VideoProps = {
  videoUrl: string;
}

const Video: React.FC<VideoProps> = ({ videoUrl }) => {
  return (
    <Box width="100%">
      <ReactPlayer url={videoUrl} width="100%" controls playing={false} />
    </Box>
  );
};

export default React.memo(Video);
