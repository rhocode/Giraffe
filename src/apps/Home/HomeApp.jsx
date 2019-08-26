import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import './main.css';
import './noscript.css';

const styles = theme => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      minHeight: theme.overrides.GraphAppBar.height
    },
    container: {
      background: '#333333',
      gridArea: 'body',
      display: 'grid',
      gridTemplateAreas: `"fullHeight"`,
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr'
    },
    listimg: {
      padding: 10,
      margin: 10
    }
  };
};

class HomeApp extends Component {
  state = {
    status: 'Logged out'
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {/* <!-- Page Wrapper --> */}
        <div id="page-wrapper">
          {/* <!-- Banner --> */}
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

              <p>
                Presenting version 2 of Satisgraphtory. Now new and improved.
              </p>

              <p>Launch the alpha.</p>

              <p>
                <a
                  href="https://satisgraphtory.com/graph"
                  className="solid-button large primary"
                >
                  Launch web app <span className="fa fa-arrow-right"></span>
                </a>
                <a
                  href="https://github.com/rhocode/Giraffe/releases"
                  className="solid-button disabled"
                >
                  Get desktop app (soon){' '}
                  <span className="fa fa-download"></span>
                </a>
              </p>
              <p>
                <a
                  href="https://old.satisgraphtory.com"
                  className="solid-button small"
                >
                  Launch old version <span className="fa fa-arrow-right"></span>
                </a>
              </p>
            </div>
          </section>

          {/* <!-- Wrapper --> */}
          <section id="wrapper">
            <div id="features">
              {/* <!-- One --> */}
              <section id="one" className="wrapper spotlight style1">
                <div className="inner">
                  <img
                    className={classes.listimg}
                    src="images/pic01.jpg"
                    alt=""
                  />
                  <div className="content">
                    <h2 className="major">Fast.</h2>
                    <p>
                      Now with a completely new HTML5 Canvas based graphics
                      engine, SatisGraphtory is faster than ever.
                    </p>
                    <p>Large, sluggish graphs are a thing of the past.</p>
                  </div>
                </div>
              </section>

              {/* <!-- Two --> */}
              <section id="two" className="wrapper alt spotlight style2">
                <div className="inner">
                  <img
                    className={classes.listimg}
                    src="images/pic02.jpg"
                    alt=""
                  />
                  <div className="content">
                    <h2 className="major">Easy Updates.</h2>
                    <p>
                      With a completely new data storage backend, it's now
                      easier than ever for us (and admins) to update recipes
                      whenever the game updates. When new data is applied, a
                      banner indicates that you should refresh to update your
                      locally stored data, and that's it!
                    </p>
                    <p>We heard your questions loud and clear!</p>
                  </div>
                </div>
              </section>

              {/* <!-- Three --> */}
              <section id="three" className="wrapper spotlight style3">
                <div className="inner">
                  <img
                    className={classes.listimg}
                    src="images/pic03.jpg"
                    alt=""
                  />
                  <div className="content">
                    <h2 className="major">More accurate simulations.</h2>
                    <p>
                      With more research and development, we can fully simulate
                      an entire factory system and alert you to bottlenecks and
                      belt backup issues.
                    </p>
                  </div>
                </div>
              </section>

              {/* <!-- Four --> */}
              <section id="four" className="wrapper alt spotlight style2">
                <div className="inner">
                  <img
                    className={classes.listimg}
                    src="https://cdn.discordapp.com/attachments/586056522883137547/600102701430472724/Screenshot_20190714-160010.png"
                    height="400"
                    alt="mobile"
                  />
                  <div className="content">
                    <h2 className="major">UI overhaul.</h2>
                    <p>
                      Designed with a "mobile-first" mentality, the layout and
                      menus are designed to be used on a small, medium, or large
                      mobile device. Desktop is, of course, perfectly
                      acceptable. With the addition of new selector, pan, and
                      revamped machine tools, creating a factory is easier than
                      ever.
                    </p>
                  </div>
                </div>
              </section>

              {/* <!-- Five --> */}
              <section id="five" className="wrapper style1">
                <div className="inner">
                  <h2 className="major" id="old">
                    Satisgraphtory version 1 features
                  </h2>
                  <p>
                    Most features have been ported over for the rewrite.
                    Features which are still in progress will be ported over
                    eventually.
                  </p>
                  <section className="features">
                    <article>
                      <img src="images/pic04.jpg" alt="" />
                      <h3 className="major">Add/Remove nodes</h3>
                      <p>Now with an improved menu!</p>
                    </article>
                    <article>
                      <img src="images/pic05.jpg" alt="" />
                      <h3 className="major">Connect nodes together</h3>
                      <p>Improved graphics!</p>
                    </article>
                    <article>
                      <img src="images/pic06.jpg" alt="" />
                      <h3 className="major">Sharing</h3>
                      <p>Work in progress!</p>
                    </article>
                    <article>
                      <img src="images/pic07.jpg" alt="" />
                      <h3 className="major">Analyze/Optimize</h3>
                      <p>Mostly done!</p>
                    </article>
                  </section>
                </div>
              </section>
            </div>
          </section>

          {/* <!-- Footer --> */}
          <section id="footer">
            <div className="inner" id="contact">
              <h2 className="major">Talk to us</h2>
              <ul className="contact">
                <li className="icon brands fa-twitter">
                  <a href="https://twitter.com/satisgraphtory">
                    @satisgraphtory
                  </a>
                </li>
                <li className="icon brands fa-discord">
                  <a href="https://discord.gg/ZRpcgqY">Discord Server</a>
                </li>
                <li className="icon brands fa-reddit">
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
                  THQ Nordic AB. Images sourced from the Satisfactory wiki,
                  which is sourced from Coffee Stain Studios AB's Satisfactory.
                </li>
                <li>
                  Site Design: <a href="http://html5up.net">HTML5 UP</a>,
                  licensed for use under the Creative Commons Attribution
                  license. Modified for use by rhoCode.
                </li>
              </ul>
            </div>
          </section>
        </div>
        {/* <Helmet>
          <script src="https://cdn.jsdelivr.net/gh/rhocode/rhocode.github.io@master/js/satisgraphtory/jquery.scrollex.min.js"></script>
          <script src="https://cdn.jsdelivr.net/gh/rhocode/rhocode.github.io@master/js/satisgraphtory/breakpoints.min.js"></script>
          <script src="https://cdn.jsdelivr.net/gh/rhocode/rhocode.github.io@master/js/satisgraphtory/browser.min.js"></script>
          <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/rhocode/rhocode.github.io@master/js/satisgraphtory/util.js"></script>
          <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/rhocode/rhocode.github.io@master/js/satisgraphtory/main.js"></script>
        </Helmet> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(withStyles(styles)(HomeApp));
