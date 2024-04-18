import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import XIcon from '@mui/icons-material/X';
import { appDomain } from '../../../setup/setup';
import { RootState } from '../../../store/reducers';
import { useLayoutStyles } from '../../../theme/layout';

interface InvitationQrCodeProps {
  open: boolean;
  onClose: () => void;
}

const QrDrawer: React.FC<InvitationQrCodeProps> = ({ open, onClose }) => {
  const layoutClasses = useLayoutStyles();
  const user = useSelector((state: RootState) => state.user.user);
  const [qrCode, setQrCode] = useState<any>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const sharedLink = user && user.profileUrlSuffix ? `${appDomain}/${user.profileUrlSuffix}` : null;

  // Dynamically import QRCodeStyling
  useEffect(() => {
    if (open && !qrCode) {
      import("qr-code-styling").then(QRCodeStyling => {
        const qr = new QRCodeStyling.default({
          width: 200,
          height: 200,
          dotsOptions: {
            color: '#000000',
            type: 'rounded',
          },
        });
        setQrCode(qr);
      });
    }
  }, [open, qrCode]);

  useEffect(() => {
    if (open && qrCode && qrContainerRef.current) {
      qrCode.append(qrContainerRef.current);
      const newData = `${appDomain}/${user?.profileUrlSuffix}`;
      qrCode.update({ data: newData });
    }
  }, [open, qrCode, user?.profileUrlSuffix]);

  const handleCopyToClipboard = () => {
    if (sharedLink) {
      navigator.clipboard.writeText(sharedLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={layoutClasses.radiusBottomDrawer}
    >
      <Box
        minHeight={450}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box width={200} height={200}>
          {open && <div id="qr-container" ref={qrContainerRef} style={{ width: 200, height: 200 }}></div>}
        </Box>
        <Box mt={2}>
          <Typography variant="body1" sx={{ color: '#2A3141' }}>
            Share Our Restaurant
          </Typography>
        </Box>
        {sharedLink && (
          <Box display="flex" alignItems="flex-start" justifyContent="center" flexWrap="wrap" p={1} gap={2}>
            <IconButton
              aria-label="copy"
              color="primary"
              onClick={handleCopyToClipboard}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#2A3141',
                color: '#fff',
                '& svg': {
                  fontSize: 16
                },
                '&:hover': {
                  backgroundColor: '#2A3141',
                }
              }}
            >
              <ContentCopyIcon />
            </IconButton>

            <EmailShareButton url={sharedLink} subject="Check out our menu and daily specials.">
              <EmailIcon size={32} round />
            </EmailShareButton>

            <FacebookShareButton url={sharedLink}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={sharedLink} title="Check out our menu and daily specials.">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#000000',
                  color: '#fff',
                  borderRadius: 100,
                }}
              >
                <XIcon sx={{ fontSize: 16 }} />
              </Box>
            </TwitterShareButton>

            <LinkedinShareButton url={sharedLink} title="Check out our menu and daily specials.">
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={sharedLink} title="Check out our menu and daily specials.">
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </Box>
        )}
        <Box
          sx={{
            ...layoutClasses.stickyModalCloseButton,
            position: 'absolute'
          }}
        >
          <IconButton
            aria-label="delete"
            color="primary"
            sx={layoutClasses.drawerCloseButtonRight}
            onClick={onClose}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </Box>
      </Box>
      
    </Drawer>
  );
};

export default QrDrawer;
