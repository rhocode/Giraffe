import React, { Component } from 'react';
import './App.css';
import Page from './components/Page';
import Header from './components/Header';
import { Menu, MenuLinks, MenuTrigger } from './components/Menu';
import Card from './components/Card';
import Section from './components/Section';
import Spotlight from './components/Spotlight';
import Copyright from './components/Copyright';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  faDiscord,
  faRedditAlien,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';

class HomeApp extends Component {
  state = {
    showMenu: false
  };
  toggleMenu = (showMenu = false) => {
    this.setState({ showMenu });
  };

  render() {
    return (
      <Page>
        <Header>
          <h1>
            <img
              alt="satisgraphtory logo"
              className="header-logo"
              src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory_square.png"
            />
          </h1>
          <MenuTrigger onClick={() => this.toggleMenu(true)} />
        </Header>
        <Menu
          showMenu={this.state.showMenu}
          closePortal={() => this.toggleMenu(false)}
        >
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
          <div className="inner">
            <div className="logo">
              <img
                alt="satisgraphtory logo"
                width="100"
                src="https://raw.githubusercontent.com/rhocode/rhocode.github.io/master/img/satisgraphtory_square.png"
              ></img>
              <h2>Satisgraphtory</h2>
            </div>

            <p>Presenting version 2 of Satisgraphtory. Now new and improved.</p>

            <p>Launch the alpha.</p>

            <p>
              <a
                href="https://satisgraphtory.com/#"
                className="button large primary disabled"
              >
                Launch web app (soon) <FontAwesomeIcon icon={faArrowRight} />
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
          </div>
        </section>

        <main id="wrapper">
          <div id="new"></div>
          <Section id="one" style1 right>
            <Spotlight
              right
              img="https://unsplash.it/450/450/?random"
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
              img="https://unsplash.it/450/450/?random"
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
                  imgSrc="https://unsplash.it/575/330/?random"
                  imgAlt="Add/Remove nodes"
                  title="Add/Remove nodes"
                  desc="Now with an improved menu!"
                />
                <Card
                  imgSrc="https://unsplash.it/575/330/?random"
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
                &copy; <a href="https://rhocode.com">rhoCode</a> 2019
              </p>
              <p>
                Not affiliated with Satisfactory, Coffee Stain Studios AB, or
                THQ Nordic AB. Images sourced from the Satisfactory wiki, which
                is sourced from Coffee Stain Studios AB's Satisfactory.
              </p>
              <p>
                Site Design: <a href="http://html5up.net">HTML5 UP</a>, licensed
                for use under the Creative Commons Attribution license. Modified
                for use by rhoCode.
              </p>
            </Copyright>
          </div>
        </footer>
      </Page>
    );
  }
}

export default HomeApp;
