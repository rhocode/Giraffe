import React from 'react';

import Page from './components/Page';
import Header from './components/Header';
import { Menu, MenuLinks, MenuTrigger } from './components/Menu';
import Card from './components/Card';
import Section from './components/Section';
import Spotlight from './components/Spotlight';
import Copyright from './components/Copyright';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faDownload,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import {
  faDiscord,
  faGithub,
  faRedditAlien,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import LoadingScreen from 'common/react/LoadingScreen';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import satisgraphtory2_square from '../../images/satisgraphtory2_square.png';
import satisgraphtory2_square_with_background from '../../images/satisgraphtory2_square_with_background.png';

import './App.css';
import 'fontsource-raleway/400-normal.css';
import 'fontsource-source-sans-pro/400-normal.css';

function HomeApp() {
  const [showMenu, setShowMenu] = React.useState(false);

  React.useEffect(() => {
    window.prerenderReady = true;
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Page>
        <Helmet>
          <meta
            property="og:title"
            content={
              'SatisGraphtory | Satisfactory Calculator & Building Graph Simulation'
            }
          />
          <meta property="og:site_name" content={window.location.hostname} />
          <meta
            property="og:image"
            content={'https://i.imgur.com/DPEmxE0.png'}
          />
          <meta
            property="og:description"
            content={
              'Feature-rich Satisfactory calculator and factory optimization simulation tool '
            }
          />
          <meta property="og:url " content={window.location.href} />
          <title>
            {
              'SatisGraphtory | Satisfactory Calculator & Building Graph Simulation'
            }
          </title>
        </Helmet>
        <Header>
          <h1>
            <img
              alt="satisgraphtory logo"
              className="header-logo"
              src={satisgraphtory2_square}
            />
          </h1>
          <MenuTrigger onClick={() => setShowMenu(true)} />
        </Header>
        <Menu showMenu={showMenu} closePortal={() => setShowMenu(false)}>
          <h2>Menu</h2>
          <MenuLinks>
            <a href="#top" key="top">
              Top
            </a>
            <a href="#new" key="new">
              New features
            </a>
            <a href="#old" key="old">
              Version 1 features
            </a>
            <a href="#contact" key="contact">
              Contact
            </a>
            <a
              href="/terms"
              rel="noopener noreferrer external nofollow noopener"
              target="_blank"
              key="terms"
            >
              Terms and Conditions
            </a>
            <a
              href="/privacy"
              rel="noopener noreferrer external nofollow noopener"
              target="_blank"
              key="privacy"
            >
              Privacy Policy
            </a>
          </MenuLinks>
        </Menu>

        <section id="banner">
          {/*<img*/}
          {/*  className="bubble"*/}
          {/*  alt="satisgraphtory logo"*/}
          {/*  width="100"*/}
          {/*  src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory_square.png"*/}
          {/*></img>*/}
          <div className="inner">
            <div className="logo">
              <img
                alt="satisgraphtory logo"
                width="100"
                src={satisgraphtory2_square_with_background}
              />
              <h2>Satisgraphtory</h2>
            </div>

            <p>
              Now an open source library. Generate resource chains with ease.
            </p>

            <p>Launch the version 2 library showcase app.</p>

            <p>
              <a href="/graph" className="button large primary">
                Launch web app <FontAwesomeIcon icon={faArrowRight} />
              </a>
              <a
                href="https://satisgraphtory.com/#"
                className="button disabled"
              >
                Get desktop app (soon) <FontAwesomeIcon icon={faDownload} />
              </a>
            </p>
            <p>
              <a href="https://old.satisgraphtory.com" className="button small">
                Launch old version <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </p>
            <p>
              <a
                href="https://github.com/rhocode/Giraffe"
                className="button small"
              >
                Satisgraphtory on GitHub <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="https://github.com/rhocode/Giraffe/blob/master/CONTRIBUTING.md"
                className="button small"
              >
                Contribute to the project <FontAwesomeIcon icon={faPen} />
              </a>
            </p>
          </div>
        </section>

        <main id="wrapper">
          <div id="new" />
          <Section id="one" style1 right>
            <Spotlight
              right
              img="https://i.imgur.com/P8cpb2O.png"
              imgAlt="fast"
              title="Fast."
              desc={
                <span>
                  Now with a completely new HTML5 Canvas based graphics engine
                  powered by{' '}
                  <a
                    href="https://www.pixijs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PixiJS
                  </a>
                  , SatisGraphtory is faster than ever.
                  <br />
                  Large, sluggish graphs are a thing of the past.
                </span>
              }
            />
          </Section>
          <Section id="two" style2 left>
            <Spotlight
              left
              img="https://i.imgur.com/byhlZe2.png"
              imgAlt="updates"
              title="Easy Updates."
              desc={
                <span>
                  With a completely new data storage backend powered by{' '}
                  <a
                    href="https://github.com/ficsit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FicsIt/data-engineering
                  </a>
                  , whenever the game updates, we'll be able to update the app's
                  data quickly. When new data is applied, a banner indicates
                  that you should refresh to update your locally stored data,
                  and that's it!
                </span>
              }
            />
          </Section>
          <Section id="three" style3 right>
            <Spotlight
              right
              img="https://i.imgur.com/47uQRlC.png"
              imgAlt="simulations"
              title="More accurate simulations."
              desc={
                <span>
                  With more research and development, we can fully simulate an
                  entire factory system and alert you to bottlenecks and belt
                  backup issues*.
                  <br />
                  *Fluids not yet supported.
                </span>
              }
            />
          </Section>
          {/* <Section id="four" style2 left>
            <Spotlight
              left
              img="https://cdn.discordapp.com/attachments/586056522883137547/600102701430472724/Screenshot_20190714-160010.png"
              imgAlt="ui overhaul"
              title="UI Overhaul."
              desc='Designed with a "mobile-first" mentality, the layout and
              menus are designed to be used on a small, medium, or large
              mobile device. Desktop is, of course, perfectly
              acceptable. With the addition of new selector, pan, and
              revamped machine tools, creating a factory is easier than
              ever.'
            />
          </Section> */}

          <Section id="four" style2 left>
            <div className="inner">
              <h2 className="major" id="old">
                Satisgraphtory version 1 features
              </h2>
              <p>
                Most features have been ported over for the rewrite. Features
                which are still in progress will be ported over eventually.
              </p>
              <section className="features">
                <Card
                  imgSrc="https://cdn.discordapp.com/attachments/129647483738390528/617467631209021456/unknown.png"
                  imgAlt="Add/Remove nodes"
                  title="Add/Remove nodes"
                  desc="Now with an improved menu!"
                />
                <Card
                  imgSrc="https://i.imgur.com/pwOuBXB.png"
                  imgAlt="Connect nodes"
                  title="Connect nodes"
                  desc="Improved graphics!"
                />
                <Card
                  imgSrc="https://unsplash.it/575/330/?random"
                  imgAlt="Sharing"
                  title="Sharing"
                  desc="Work in progress!"
                />
                <Card
                  imgSrc="https://unsplash.it/575/330/?random"
                  imgAlt="Analyze/Optimize"
                  title="Analyze/Optimize"
                  desc="Not done yet!"
                />
              </section>
            </div>
          </Section>
        </main>
        <footer id="footer">
          <div className="inner" id="contact">
            <h2 className="major">Talk to us</h2>

            <a
              className="button contact-button"
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/satisgraphtory"
            >
              <FontAwesomeIcon icon={faTwitter} className="contact-icon" />{' '}
              @satisgraphtory
            </a>
            <a
              className="button contact-button"
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/ZRpcgqY"
            >
              <FontAwesomeIcon icon={faDiscord} className="contact-icon" />{' '}
              Discord Server
            </a>
            <a
              className="button contact-button"
              target="_blank"
              rel="noopener noreferrer"
              href="https://reddit.com/r/satisgraphtory"
            >
              <FontAwesomeIcon icon={faRedditAlien} className="contact-icon" />{' '}
              /r/satisgraphtory
            </a>
            <Copyright>
              <p>
                &copy;{' '}
                <a
                  href="https://rhocode.com"
                  rel="noopener noreferrer external nofollow noopener"
                  target="_blank"
                >
                  rhoCode
                </a>{' '}
                2020
                <br />
                <br />
                Not affiliated with Satisfactory, Coffee Stain Studios AB, or
                THQ Nordic AB.
                <br />
                <br />
                Site Design:{' '}
                <a
                  href="http://html5up.net"
                  rel="noopener noreferrer external nofollow noopener"
                  target="_blank"
                >
                  HTML5 UP
                </a>
                , licensed for use under the Creative Commons Attribution
                license. Modified for use by rhoCode.
                <br />
                <br />
                <a
                  href="terms"
                  rel="noopener noreferrer external nofollow noopener"
                  target="_blank"
                >
                  Terms and Conditions
                </a>
                <br />
                <br />
                <a
                  href="privacy"
                  rel="noopener noreferrer external nofollow noopener"
                  target="_blank"
                >
                  Privacy Policy
                </a>
              </p>
            </Copyright>
          </div>
        </footer>
        <a
          href="https://www.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="netlify"
        >
          <img
            src="https://www.netlify.com/img/global/badges/netlify-light.svg"
            alt="netlify logo"
          />
        </a>
      </Page>
    </Suspense>
  );
}

export default HomeApp;
