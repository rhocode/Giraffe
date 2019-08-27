import React, { useEffect } from 'react';
import Modal from 'react-modal';

import styles from './Menu.module.css';

function Menu({ showMenu, closePortal, children }) {
  useEffect(() => {
    try {
      Modal.setAppElement('#root');
    } catch (e) {
      // noop
    }
  }, []);

  return (
    <Modal
      isOpen={showMenu}
      onRequestClose={closePortal}
      className={styles.modal}
      overlayClassName={styles.backdrop}
      bodyOpenClassName={styles.blur}
      contentLabel="Open site menu"
    >
      <nav className={styles.menu}>
        {children}
        <button className={styles.close} type="button" onClick={closePortal}>
          Close
        </button>
      </nav>
    </Modal>
  );
}

const MenuLinks = ({ children }) => (
  <ul className={styles.links}>
    {children.map(child => (
      <li className={styles.link}>{child}</li>
    ))}
  </ul>
);

const MenuTrigger = ({ onClick }) => (
  <button className={styles.trigger} type="button" onClick={onClick}>
    Menu
  </button>
);

export default Menu;
export { Menu, MenuLinks, MenuTrigger };
