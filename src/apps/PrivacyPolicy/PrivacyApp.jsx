import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://SatisGraphtory2.com/">
        SatisGraphtory
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: '1em',
      listStyle: 'square',
    },
    li: {
      paddingLeft: '0.5em',
    },
    a: {
      color: '#3399ff',
    },
    h1: {
      paddingBottom: '1em',
    },
    h4: {
      paddingTop: '1em',
    },
    p: {
      paddingTop: '0.5em',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    maxWidth: '60em',
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function PrivacyApp() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          SatisGraphtory Privacy Policy
        </Typography>
        <Typography variant="h4">Changes to This Privacy Policy</Typography>
        <Typography variant="body1">
          Alexander Fu and the SatisGraphtory maintainers may update our Privacy
          Policy from time to time. Thus, you are advised to review this page
          periodically for any changes. Alexander Fu and the SatisGraphtory
          maintainers will notify you of any changes by posting the new Privacy
          Policy on this page.
        </Typography>
        <Typography variant="body1">
          <strong>This policy is effective as of 2020-11-21.</strong>
        </Typography>
        <Typography variant="h4">Interpretation and Definitions</Typography>
        <h2>Interpretation</h2>
        <Typography variant="body1">
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </Typography>
        <h2>Definitions</h2>
        <Typography variant="body1">
          For the purposes of this Privacy Policy:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              <strong>Account</strong> means a unique account created for You to
              access our Service or parts of our Service.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Company</strong> (referred to as either &quot;the
              Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;
              in this Agreement) refers to SatisGraphtory.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Cookies</strong> are small files that are placed on Your
              computer, mobile device or any other device by a website,
              containing the details of Your browsing history on that website
              among its many uses.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Country</strong> refers to: New Jersey, United States
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Device</strong> means any device that can access the
              Service such as a computer, a cellphone or a digital tablet.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Personal Data</strong> is any information that relates to
              an identified or identifiable individual.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Service</strong> refers to the Website.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Service Provider</strong> means any natural or legal
              person who processes the data on behalf of the Company. It refers
              to third-party companies or individuals employed by the Company to
              facilitate the Service, to provide the Service on behalf of the
              Company, to perform services related to the Service or to assist
              the Company in analyzing how the Service is used.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Third-party Social Media Service</strong> refers to any
              website or any social network website through which a User can log
              in or create an account to use the Service.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Usage Data</strong> refers to data collected
              automatically, either generated by the use of the Service or from
              the Service infrastructure itself (for example, the duration of a
              page visit).
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Website</strong> refers to SatisGraphtory, accessible from{' '}
              <a
                href="https://SatisGraphtory2.com"
                rel="noopener noreferrer external nofollow noopener"
                target="_blank"
              >
                SatisGraphtory2.com
              </a>
              .
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>You</strong> means the individual accessing or using the
              Service, or the company, or other legal entity on behalf of which
              such individual is accessing or using the Service, as applicable.
            </Typography>
          </li>
        </ul>

        <Typography variant="h4">
          Collecting and Using Your Personal Data
        </Typography>
        <Typography variant="body1">
          Alexander Fu built the SatisGraphtory app as an Open Source app. This
          service is provided by Alexander Fu at no cost and is intended for use
          as is.
        </Typography>
        <Typography variant="body1">
          This page is used to inform visitors regarding our policies with the
          collection, use, and disclosure of Personal Information if anyone
          decided to use our Service.
        </Typography>
        <Typography variant="body1">
          If you choose to use our Service, then you agree to the collection and
          use of information in relation to this policy. The Personal
          Information that Alexander Fu and the SatisGraphtory maintainers
          collect is used for providing and improving the Service. We will not
          use or share your information with anyone except as described in this
          Privacy Policy.
        </Typography>
        <Typography variant="body1">
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at{' '}
          <a
            href="/terms"
            rel="noopener noreferrer external nofollow noopener"
            target="_blank"
          >
            SatisGraphtory Terms and Conditions
          </a>{' '}
          unless otherwise defined in this Privacy Policy.
        </Typography>
        <Typography variant="h4">Information Collection and Use</Typography>
        <Typography variant="body1">
          For a better experience, while using our Service, we may require you
          to provide us with certain personally identifiable information. The
          information that we request will be retained on your device and is not
          collected by Alexander Fu and the SatisGraphtory Alexander Fu and
          SatisGraphtory maintainers in any way.
        </Typography>
        <Typography variant="body1">
          The app does use third party services that may collect information
          used to identify you.
        </Typography>
        <Typography variant="body1">
          Link to privacy policy of third party service providers used by the
          app{' '}
          <a
            href="https://sentry.io/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sentry
          </a>
          .
        </Typography>

        <Typography variant="h4">Log Data</Typography>
        <Typography variant="body1">
          We want to inform you that whenever you use our Service, in a case of
          an error in the app we collect data and information (through third
          party products) on your phone called Log Data. This Log Data may
          include information such as your device Internet Protocol (“IP”)
          address, device name, operating system version, the configuration of
          the app when utilizing our Service, the time and date of your use of
          the Service, and other statistics.
        </Typography>
        <Typography variant="h4">Cookies</Typography>
        <Typography variant="body1">
          Cookies are files with a small amount of data that are commonly used
          as anonymous unique identifiers. These are sent to your browser from
          the websites that you visit and are stored on your device's internal
          memory.
        </Typography>
        <Typography variant="body1">
          This Service does not use these “cookies” explicitly. However, the app
          may use third party code and libraries that use “cookies” to collect
          information and improve their services. You have the option to either
          accept or refuse these cookies and know when a cookie is being sent to
          your device. If you choose to refuse our cookies, you may not be able
          to use some portions of this Service.
        </Typography>
        <Typography variant="h4">Google Analytics</Typography>
        <Typography variant="body1">
          We may use third party services such as Google Analytics that collect,
          monitor and analyze this type of information in order forecast user
          trends and expected costs for maintaining the service. These third
          party service providers have their own privacy policies addressing how
          they use such information. If you would like to opt-out from this
          tracking, we encourage you to do so here at{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout/"
            rel="noopener noreferrer external nofollow noopener"
            target="_blank"
          >
            Google Analytics Opt-out
          </a>
          .
        </Typography>
        <Typography variant="h4">Google OAuth Usage</Typography>
        <Typography variant="body1">
          The SatisGraphtory app utilizes Google OAuth to view files from your
          Google Drive that you have opened with this app or that are shared
          publicly. The purpose of this data is to save and load your
          SatisGraphtory designs. Doing so will allow us to keep the site free
          to use and ad-free. Your email and personal information is only used
          to authenticate with your Google account and is not persisted
          elsewhere.
        </Typography>
        <Typography variant="h4">Service Providers</Typography>
        <Typography variant="body1">
          We may employ third-party companies and individuals due to the
          following reasons:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">To facilitate our Service;</Typography>
          </li>
          <li>
            <Typography variant="body1">
              To provide the Service on our behalf;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              To perform Service-related services; or
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              To assist us in analyzing how our Service is used.
            </Typography>
          </li>
        </ul>
        <Typography variant="body1">
          We want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </Typography>
        <Typography variant="h4">Security</Typography>
        <Typography variant="body1">
          We value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and we
          cannot guarantee its absolute security.
        </Typography>
        <Typography variant="h4">Links to Other Sites</Typography>
        <Typography variant="body1">
          This Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by Alexander Fu and the SatisGraphtory
          maintainers. Therefore, we strongly advise you to review the Privacy
          Policy of these websites. We have no control over and assume no
          responsibility for the content, privacy policies, or practices of any
          third-party sites or services.
        </Typography>
        <Typography variant="h4">Children’s Privacy</Typography>
        <Typography variant="body1">
          These Services do not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from children
          under 13. In the case we discover that a child under 13 has provided
          Alexander Fu or the SatisGraphtory maintainers with personal
          information, we immediately delete this from our servers. If you are a
          parent or guardian and you are aware that your child has provided us
          with personal information, please contact Alexander Fu or the
          SatisGraphtory maintainers so that we will be able to do necessary
          actions.
        </Typography>
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1">
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact Alexander Fu or the SatisGraphtory maintainers
          at satisgraphtory@rhocode.com.
        </Typography>
      </Container>

      {/* Footer */}
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}
