import React from 'react';
import Modal from 'react-modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './Menu.module.css';

Modal.setAppElement('#root');

const Menu = ({ showMenu, closePortal, children }) => (
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
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </nav>
  </Modal>
);

const MenuLinks = ({ children }) => (
  <ul className={styles.links}>
    {children.map(child => (
      <li className={styles.link} key={child.key}>
        {child}
      </li>
    ))}
  </ul>
);

const MenuTrigger = ({ onClick }) => (
  <button className={styles.trigger} type="button" onClick={onClick}>
    Menu <FontAwesomeIcon icon={faBars} />
  </button>
);

export default Menu;
export { Menu, MenuLinks, MenuTrigger };
