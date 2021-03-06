import React from 'react';
import Head from 'next/head';
import Nav from '../components/nav';
import { css } from '@emotion/core';

const heroStyle = css({
  width: '100%',
  color: '#333',
  '& h1': {
    margin: 0,
    width: '100%',
    paddingTop: '80px',
    lineHeight: '1.15',
    fontsize: '48px',
    textAlign: 'center',
  },
});

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div css={heroStyle}>
      <h1 className="title">AssureSign OAUTH2 Demo</h1>
    </div>
    <div
      css={{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '20px 10px 10px 30px',
      }}
    >
      <div css={{ width: '600px' }}>
        Access an external resource (Microsoft Graph) using On behalf of
        authorization grant
      </div>
      <div>
        <a href="/connect">Go</a>
      </div>
    </div>
    <div
      css={{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '20px 10px 10px 30px',
      }}
    >
      <div css={{ width: '600px' }}>
        Grant external resource access to AssureSign via on behalf of
        authorization grant
      </div>
      <div>
        <a href="/inbound_connect">Go</a>
      </div>
    </div>
  </div>
);

export default Home;
