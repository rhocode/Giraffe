import {
  faDiscord,
  faGithub,
  faRedditAlien,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faDownload,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingScreen from 'common/react/LoadingScreen';
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import satisgraphtory2_square from '../../images/satisgraphtory2_square.png';
import satisgraphtory2_square_with_background from '../../images/satisgraphtory2_square_with_background.png';
import Card from './components/Card';
import Copyright from './components/Copyright';
import Header from './components/Header';
import { Menu, MenuLinks, MenuTrigger } from './components/Menu';

import Page from './components/Page';
import Section from './components/Section';
import Spotlight from './components/Spotlight';

import './App.css';
require('typeface-raleway');
require('typeface-source-sans-pro');

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
              img="https://cdn.discordapp.com/attachments/129647483738390528/617464176146907137/unknown.png"
              imgAlt="fast"
              title="Fast."
              desc="Now with a completely new HTML5 Canvas based graphics
              engine, SatisGraphtory is faster than ever.
              Large, sluggish graphs are a thing of the past."
            />
          </Section>
          <Section id="two" style2 left>
            <Spotlight
              left
              img="https://cdn.discordapp.com/attachments/129647483738390528/617464278848634880/unknown.png"
              imgAlt="updates"
              title="Easy Updates."
              desc="With a completely new data storage backend, it's now
              easier than ever for us (and admins) to update recipes
              whenever the game updates. When new data is applied, a
              banner indicates that you should refresh to update your
              locally stored data, and that's it!"
            />
          </Section>
          <Section id="three" style3 right>
            <Spotlight
              right
              img="https://unsplash.it/450/450/?random"
              imgAlt="simulations"
              title="More accurate simulations."
              desc="With more research and development, we can fully simulate
              an entire factory system and alert you to bottlenecks and
              belt backup issues."
            />
          </Section>
          <Section id="four" style2 left>
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
          </Section>

          <Section id="five" style1 right>
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
                  imgSrc="https://cdn.discordapp.com/attachments/129647483738390528/617629393405083648/unknown.png"
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
                  desc="Mostly done!"
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
                &copy; <a href="https://rhocode.com">rhoCode</a> 2020
                <br />
                <br />
                Not affiliated with Satisfactory, Coffee Stain Studios AB, or
                THQ Nordic AB. Images sourced from the Satisfactory wiki, which
                is sourced from Coffee Stain Studios AB's Satisfactory.
                <br />
                <br />
                Site Design: <a href="http://html5up.net">HTML5 UP</a>, licensed
                for use under the Creative Commons Attribution license. Modified
                for use by rhoCode.
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
