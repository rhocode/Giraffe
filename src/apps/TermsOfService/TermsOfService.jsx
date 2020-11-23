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
      paddingLeft: '1em',
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
          SatisGraphtory Terms and Conditions
        </Typography>

        <Typography variant="h4">
          Changes to These Terms and Conditions
        </Typography>
        <Typography variant="body1">
          Alexander Fu and the SatisGraphtory maintainers may update our Terms
          and Conditions from time to time. Thus, you are advised to review this
          page periodically for any changes. Alexander Fu and the SatisGraphtory
          maintainers will notify you of any changes by posting the new Terms
          and Conditions on this page.
        </Typography>
        <Typography variant="body1">
          <strong>This policy is effective as of 2020-11-21.</strong>
        </Typography>
        <Typography variant="h4">Terms and Conditions</Typography>
        <Typography variant="body1">Welcome to SatisGraphtory!</Typography>

        <Typography variant="body1">
          These terms and conditions outline the rules and regulations for the
          use of SatisGraphtory's Website, located at{' '}
          <a
            href="https://SatisGraphtory2.com"
            rel="noopener noreferrer external nofollow noopener"
            target="_blank"
          >
            SatisGraphtory2.com
          </a>
          .
        </Typography>
        <Typography variant="body1">
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use SatisGraphtory if you do not agree
          to take all of the terms and conditions stated on this page.
        </Typography>
        <Typography variant="body1">
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: "Client",
          "You" and "Your" refers to you, the person log on this website and
          compliant to the Company’s terms and conditions. "The Company",
          "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
          "Parties", or "Us", refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client’s
          needs in respect of provision of the Company’s stated services, in
          accordance with and subject to, prevailing law of Netherlands. Any use
          of the above terminology or other words in the singular, plural,
          capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to same.
        </Typography>

        <Typography variant="h4">Cookies</Typography>
        <Typography variant="body1">
          We employ the use of cookies. By accessing SatisGraphtory, you agreed
          to use cookies in agreement with the SatisGraphtory's Privacy Policy.{' '}
        </Typography>

        <Typography variant="body1">
          Most interactive websites use cookies to let us retrieve the user’s
          details for each visit. Cookies are used by our website to enable the
          functionality of certain areas to make it easier for people visiting
          our website. Some of our affiliate/advertising partners may also use
          cookies.
        </Typography>

        <Typography variant="h4">License</Typography>

        <Typography variant="body1">
          Unless otherwise stated, SatisGraphtory and/or its licensors own the
          intellectual property rights for all material on SatisGraphtory. All
          intellectual property rights are reserved. You may access this from
          SatisGraphtory for your own personal use subjected to restrictions set
          in these terms and conditions.
        </Typography>

        <Typography variant="body1">You must not:</Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Republish material from SatisGraphtory
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Sell, rent or sub-license material from SatisGraphtory
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Reproduce, duplicate or copy material from SatisGraphtory
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Redistribute content from SatisGraphtory
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          This Agreement shall begin on the date hereof. Our Terms and
          Conditions were created with the help of the{' '}
          <a href="https://www.termsandconditionsgenerator.com">
            Terms And Conditions Generator
          </a>{' '}
          and the{' '}
          <a href="https://www.generateprivacypolicy.com">
            Privacy Policy Generator
          </a>
          .
        </Typography>

        <Typography variant="body1">
          Many of our services allow you to interact with others. We want to
          maintain a respectful environment for everyone, which means you must
          follow these basic rules of conduct:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Comply with applicable laws, including export control, sanctions,
              and human trafficking laws
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Respect the rights of others, including privacy and intellectual
              property rights
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Don’t abuse or harm others or yourself (or threaten or encourage
              such abuse or harm) — for example, by misleading, defrauding,
              defaming, bullying, harassing, or stalking others
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Don’t abuse, harm, interfere with, or disrupt the Services
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          You hereby grant SatisGraphtory a non-exclusive license to use,
          reproduce, edit and authorize others to use, reproduce and edit any of
          your Products in any and all forms, formats or media.
        </Typography>

        <Typography variant="h4">Hyperlinking to our Content</Typography>

        <Typography variant="body1">
          The following organizations may link to our Website without prior
          written approval:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">Government agencies;</Typography>
          </li>
          <li>
            <Typography variant="body1">Search engines;</Typography>
          </li>
          <li>
            <Typography variant="body1">News organizations;</Typography>
          </li>
          <li>
            <Typography variant="body1">
              Online directory distributors may link to our Website in the same
              manner as they hyperlink to the Websites of other listed
              businesses; and
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              System wide Accredited Businesses except soliciting non-profit
              organizations, charity shopping malls, and charity fundraising
              groups which may not hyperlink to our Web site.
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          These organizations may link to our home page, to publications or to
          other Website information so long as the link: (a) is not in any way
          deceptive; (b) does not falsely imply sponsorship, endorsement or
          approval of the linking party and its products and/or services; and
          (c) fits within the context of the linking party’s site.
        </Typography>

        <Typography variant="body1">
          We may consider and approve other link requests from the following
          types of organizations:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              commonly-known consumer and/or business information sources;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">dot.com community sites;</Typography>
          </li>
          <li>
            <Typography variant="body1">
              associations or other groups representing charities;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              online directory distributors;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">internet portals;</Typography>
          </li>
          <li>
            <Typography variant="body1">
              accounting, law and consulting firms; and
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              educational institutions and trade associations.
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          We will approve link requests from these organizations if we decide
          that: (a) the link would not make us look unfavorably to ourselves or
          to our accredited businesses; (b) the organization does not have any
          negative records with us; (c) the benefit to us from the visibility of
          the hyperlink compensates the absence of SatisGraphtory; and (d) the
          link is in the context of general resource information.
        </Typography>

        <Typography variant="body1">
          These organizations may link to our home page so long as the link: (a)
          is not in any way deceptive; (b) does not falsely imply sponsorship,
          endorsement or approval of the linking party and its products or
          services; and (c) fits within the context of the linking party’s site.
        </Typography>

        <Typography variant="body1">
          If you are one of the organizations listed in paragraph 2 above and
          are interested in linking to our website, you must inform us by
          sending an e-mail to SatisGraphtory. Please include your name, your
          organization name, contact information as well as the URL of your
          site, a list of any URLs from which you intend to link to our Website,
          and a list of the URLs on our site to which you would like to link.
          Wait 2-3 weeks for a response.
        </Typography>

        <Typography variant="body1">
          Approved organizations may hyperlink to our Website as follows:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              By use of our corporate name; or
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              By use of the uniform resource locator being linked to; or
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              By use of any other description of our Website being linked to
              that makes sense within the context and format of content on the
              linking party’s site.
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          No use of SatisGraphtory's logo or other artwork will be allowed for
          linking absent a trademark license agreement.
        </Typography>

        <Typography variant="h4">iFrames</Typography>

        <Typography variant="body1">
          Without prior approval and written permission, you may not create
          frames around our Webpages that alter in any way the visual
          presentation or appearance of our Website.
        </Typography>

        <Typography variant="h4">Content Liability</Typography>

        <Typography variant="body1">
          We shall not be hold responsible for any content that appears on your
          Website. You agree to protect and defend us against all claims that is
          rising on your Website. No link(s) should appear on any Website that
          may be interpreted as libelous, obscene or criminal, or which
          infringes, otherwise violates, or advocates the infringement or other
          violation of, any third party rights.
        </Typography>

        <Typography variant="h4">Your Privacy</Typography>

        <Typography variant="body1">
          Please read our{' '}
          <a
            href="/privacy"
            rel="noopener noreferrer external nofollow noopener"
            target="_blank"
          >
            Privacy Policy
          </a>
          .
        </Typography>

        <Typography variant="h4">Reservation of Rights</Typography>

        <Typography variant="body1">
          We reserve the right to request that you remove all links or any
          particular link to our Website. You approve to immediately remove all
          links to our Website upon request. We also reserve the right to amen
          these terms and conditions and it’s linking policy at any time. By
          continuously linking to our Website, you agree to be bound to and
          follow these linking terms and conditions.
        </Typography>

        <Typography variant="h4">Removal of links from our website</Typography>

        <Typography variant="body1">
          If you find any link on our Website that is offensive for any reason,
          you are free to contact and inform us any moment. We will consider
          requests to remove links but we are not obligated to or so or to
          respond to you directly.
        </Typography>

        <Typography variant="body1">
          We do not ensure that the information on this website is correct, we
          do not warrant its completeness or accuracy; nor do we promise to
          ensure that the website remains available or that the material on the
          website is kept up to date.
        </Typography>

        <Typography variant="h4">Disclaimer</Typography>

        <Typography variant="body1">
          To the maximum extent permitted by applicable law, we exclude all
          representations, warranties and conditions relating to our website and
          the use of this website. Nothing in this disclaimer will:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              limit or exclude our or your liability for death or personal
              injury;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation;
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              limit any of our or your liabilities in any way that is not
              permitted under applicable law; or
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              exclude any of our or your liabilities that may not be excluded
              under applicable law.
            </Typography>
          </li>
        </ul>

        <Typography variant="body1">
          The limitations and prohibitions of liability set in this Section and
          elsewhere in this disclaimer: (a) are subject to the preceding
          paragraph; and (b) govern all liabilities arising under the
          disclaimer, including liabilities arising in contract, in tort and for
          breach of statutory duty.
        </Typography>

        <Typography variant="body1">
          As long as the website and the information and services on the website
          are provided free of charge, we will not be liable for any loss or
          damage of any nature.
        </Typography>
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1">
          If you have any questions or suggestions about our Terms and
          Conditions, do not hesitate to contact Alexander Fu or the
          SatisGraphtory maintainers at satisgraphtory@rhocode.com.
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
