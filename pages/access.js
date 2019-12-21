import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
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
    textAlign: 'center'
  }
});

const Access = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div css={heroStyle}>
      <h1 className="title">Use external</h1>
    </div>
  </div>
)

export default Access
