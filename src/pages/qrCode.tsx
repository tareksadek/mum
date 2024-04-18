import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { Button, Box } from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { appDomain } from '../setup/setup';
import { restaurantSelector } from '../store/selectors/restaurant';
import AppLayout from '../layout/AppLayout';

const QrCode: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { restaurant } = useSelector(restaurantSelector) 
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [qrCodeInstance, setQrCodeInstance] = useState<any>(null);

  useEffect(() => {
    if (user && !qrCodeInstance) {
      import("qr-code-styling").then(QRCodeStyling => {
        const qr = new QRCodeStyling.default({
          width: 200,
          height: 200,
          data: `${appDomain}/${user.profileUrlSuffix}`,
          dotsOptions: {
            color: '#000000',
            type: 'rounded',
          },
        });
        setQrCodeInstance(qr);
      });
    }
  }, [user, qrCodeInstance]);

  useEffect(() => {
    if (qrCodeInstance && qrCodeRef.current) {
      qrCodeInstance.append(qrCodeRef.current);
    }
  }, [qrCodeInstance]);

  const downloadAsSVG = () => {
    qrCodeInstance?.download({
      extension: 'svg',
      name: restaurant && restaurant.basicInfoData?.firstName ? `${restaurant.basicInfoData?.firstName}_QRcode` : 'My_Restaurant_QrCode'
    });
  };

  const downloadAsPNG = () => {
    qrCodeInstance?.download({
      extension: 'png',
      name: restaurant && restaurant.basicInfoData?.firstName ? `${restaurant.basicInfoData?.firstName}_QRcode` : 'My_Restaurant_QrCode'
    });
  };

  return (
    <AppLayout>
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box ref={qrCodeRef} sx={{
          width: 200, // Match the QR code size
          height: 200, // Match the QR code size
          '& > canvas': { // Ensure the canvas fills the box if needed
            maxWidth: '100%',
            maxHeight: '100%',
          }
        }}>
          {/* The QR code will be appended here */}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mt={2}
          minWidth={200}
        >
          <Button variant="contained" color="primary" onClick={downloadAsSVG} startIcon={<DownloadForOfflineIcon />} fullWidth>SVG</Button>
          <Button variant="contained" color="secondary" onClick={downloadAsPNG} startIcon={<DownloadForOfflineIcon />} fullWidth>PNG</Button>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default QrCode;
