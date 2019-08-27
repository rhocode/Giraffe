import * as React from 'react';
import './App.css';
import Page from './components/Page';
import Header from './components/Header';
import { Menu, MenuLinks, MenuTrigger } from './components/Menu';
import Card from './components/Card';
import Section from './components/Section';
import Spotlight from './components/Spotlight';
import Copyright from './components/Copyright';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faDiscord,
  faReddit
} from '@fortawesome/free-brands-svg-icons';

class HomeApp extends React.Component {
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
          <h1>Solid State</h1>
          <MenuTrigger onClick={() => this.toggleMenu(true)} />
        </Header>
        <Menu
          showMenu={this.state.showMenu}
          closePortal={() => this.toggleMenu(false)}
        >
          <h2>Menu</h2>
          <MenuLinks>
            <a href="index.html">Home</a>
            <a href="generic.html">Generic</a>
            <a href="elements.html">Elements</a>
            <button type="button">Log In</button>
            <button type="button">Sign Up</button>
          </MenuLinks>
        </Menu>
        <section id="banner">
          <div className="inner">
            <div className="logo">
              <span className="icon fa-diamond" />
            </div>
            <h2>This is Solid State</h2>
            <p>
              Another free + fully responsive site template by{' '}
              <a href="http://html5up.net">HTML5 UP</a>
            </p>
          </div>
        </section>
        <main id="wrapper">
          <Section id="one" style1 right>
            <Spotlight
              img="https://unsplash.it/450/450/?random"
              title="Magna arcu feugiat"
              desc="Lorem ipsum dolor sit amet, etiam lorem adipiscing elit. Cras turpis ante, nullam sit amet turpis non, sollicitudin posuere urna. Mauris id tellus arcu. Nunc vehicula id nulla dignissim dapibus. Nullam ultrices, neque et faucibus viverra, ex nulla cursus."
              to="/noneya"
            />
          </Section>
          <Section id="two" style2 left>
            <Spotlight
              left
              img="https://unsplash.it/449/449/?random"
              title="asdfasdfasdfasdf"
              desc="Nunc vehicula id nulla dignissim dapibus. Nullam ultrices, neque et faucibus viverra, ex nulla cursus."
              to="/noneya"
            />
          </Section>
          <Section id="three" style3 right>
            <Spotlight
              img="https://unsplash.it/448/448/?random"
              title="Nullam dignissim"
              desc="Lorem ipsum dolor sit amet, etiam lorem adipiscing elit. Cras turpis ante, nullam sit amet turpis non, sollicitudin posuere urna. Mauris id tellus arcu. Nunc vehicula id nulla dignissim dapibus. Nullam ultrices, neque et faucibus viverra, ex nulla cursus."
              to="/noneya"
            />
          </Section>
          <Section id="four">
            <h2 className="major">Vitae phasellus</h2>
            <p>
              Cras mattis ante fermentum, malesuada neque vitae, eleifend erat.
              Phasellus non pulvinar erat. Fusce tincidunt, nisl eget mattis
              egestas, purus ipsum consequat orci, sit amet lobortis lorem lacus
              in tellus. Sed ac elementum arcu. Quisque placerat auctor laoreet.
            </p>
            <section className="features">
              <Card
                imgSrc="https://unsplash.it/575/330/?random"
                imgAlt="test image alt"
                title="Sed feugiat lorem"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing vehicula id
                nulla dignissim dapibus ultrices."
                to="#"
              />
              <Card
                imgSrc="https://unsplash.it/570/327/?random"
                imgAlt="test image alt"
                title="Nisl placerat"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing vehicula id
                nulla dignissim dapibus ultrices."
                to="#"
              />
              <Card
                imgSrc="https://unsplash.it/565/324/?random"
                imgAlt="test image alt"
                title="Ante fermentume"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing vehicula id
                nulla dignissim dapibus ultrices."
                to="#"
              />
              <Card
                imgSrc="https://unsplash.it/560/321/?random"
                imgAlt="test image alt"
                title="Test title here"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing vehicula id nulla dignissim dapibus ultrices."
                to="#"
              />
            </section>
            <ul className="actions">
              <li>
                <a
                  href="https://reddit.com/r/satisgraphtory"
                  className="button"
                >
                  Browse All
                </a>
              </li>
            </ul>
          </Section>
        </main>
        <footer id="footer">
          <div className="inner">
            <h2 className="major">Get in touch</h2>
            <p>
              Cras mattis ante fermentum, malesuada neque vitae, eleifend erat.
              Phasellus non pulvinar erat. Fusce tincidunt, nisl eget mattis
              egestas, purus ipsum consequat orci, sit amet lobortis lorem lacus
              in tellus. Sed ac elementum arcu. Quisque placerat auctor laoreet.
            </p>
            <form method="post" action="#">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" rows="4" />
              </div>
              <div>
                <button type="submit">Send Message</button>
              </div>
            </form>
            <ul className="contact">
              <li>
                <FontAwesomeIcon icon={faTwitter} />
                <a href="https://twitter.com/satisgraphtory">@satisgraphtory</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faDiscord} />
                <a href="https://discord.gg/ZRpcgqY">Discord Server</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faReddit} />
                <a href="https://reddit.com/r/satisgraphtory">
                  /r/satisgraphtory
                </a>
              </li>
            </ul>
            <ul className="copyright">
              <li>
                &copy; <a href="https://rhocode.com">rhoCode</a> 2019
              </li>
              <li>
                Not affiliated with Satisfactory, Coffee Stain Studios AB, or
                THQ Nordic AB. Images sourced from the Satisfactory wiki, which
                is sourced from Coffee Stain Studios AB's Satisfactory.
              </li>
              <li>
                Site Design: <a href="http://html5up.net">HTML5 UP</a>, licensed
                for use under the Creative Commons Attribution license. Modified
                for use by rhoCode.
              </li>
            </ul>
            <Copyright>
              <p>&copy; Untitled Inc. All rights reserved.</p>
              <p>
                Design: <a href="http://html5up.net">HTML5 UP</a>
              </p>
            </Copyright>
          </div>
        </footer>
      </Page>
    );
  }
}

export default HomeApp;
