import Head from 'next/head';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useAppStyles } from '../layout/appStyles';
import { Logo } from '../layout/CustomIcons';
import AppContentContainer from '../layout/AppContentContainer';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const classes = useAppStyles();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>MuchMum | Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Digital Menus and Restaurant Profiles" />
        <meta name="image" content="https://muchmum-00.web.app/images/muchmum-og.jpg" />
        <meta name="theme-color" content="#222630" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MuchMum" />
        <meta name="apple-mobile-web-app-title" content="MuchMum" />
        <link rel="apple-touch-icon" href="https://muchmum-00.web.app/images/apple-touch-icon.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://muchmum-00.web.app/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://muchmum.com" />
        <meta property="og:title" content="MuchMum | Digital Menus and Restaurant Profiles" />
        <meta property="og:description" content="Digital Menus and Restaurant Profiles" />
        <meta property="og:image" content="https://muchmum-00.web.app/images/muchmum-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://muchmum.com" />
        <meta name="twitter:title" content="MuchMum | Digital Menus and Restaurant Profiles" />
        <meta name="twitter:description" content="Digital Menus and Restaurant Profiles" />
        <meta name="twitter:image" content="https://muchmum-00.web.app/images/muchmum-tw.jpg" />
      </Head>
      <Box sx={classes.mainBox}>
        <AppContentContainer>
          <Box
            sx={classes.landingPageLogoContainer}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Logo />
          </Box>
          <Box mb={4}>
            <Typography variant="h3" align="center" className="notranslate">
              MuchMum
            </Typography>
            <Typography variant="body1" align="center">
              Digital Menus and Restaurant Profiles
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            flexDirection="column"
            p={2}
          >
            <Button
              onClick={() => navigateTo('/login')}
              fullWidth
              variant="contained"
              color="primary"
            >
              Login
            </Button>
            <Button
              onClick={() => navigateTo('/createAccount')}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Create Account
            </Button>
          </Box>
          {/* <Box
            id="google_translate_element"
            sx={classes.translateContainer}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
            p={1}
          ></Box> */}
        </AppContentContainer>
      </Box>
    </>
    
  );
};

export default IndexPage;