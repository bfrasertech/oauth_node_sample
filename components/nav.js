import React from 'react';
import Link from 'next/link';
import { Global, css } from '@emotion/core';

const links = [
  { href: '/connect', label: 'Connect to external resource' },
  { href: '/access', label: 'Use external resource' },
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const globalStyle = css({
  'body': {
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Helvetica, sans-serif'
  },
  'nav': {
    textAlign: 'center',
    '& ul': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 16px',
      '& li': {
        display: 'flex',
        padding: '6px 8px',
        '& a': {
          color: '#067df7',
          textDecoration: 'none',
          fontSize: '13px'
        }
      }
    }
  },
});

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      {links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>

    <Global styles={globalStyle} />
   
  </nav>
);

export default Nav;
