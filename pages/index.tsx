import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

import styles from '../styles/Home.module.css';

const shortenUrlRequest = (url: string, alias?: string) => {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/urls`;
  const requestBody: any = {
    url,
  };
  if (alias) {
    requestBody.alias = alias;
  }

  // const body = new FormData();
  // body.append('url', url);
  // if (alias) {
  //   body.append('alias', alias);
  // }

  return fetch(requestUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(r => r.json())
  .catch(console.log)
}

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");

  const onChangeUrl = (event: React.FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };

  const onChangeAlias = (event: React.FormEvent<HTMLInputElement>) => {
    setAlias(event.currentTarget.value);
  };

  const onSubmit = () => {
    if (!url) {
      alert('Please enter a URL to be shortened');
      return;
    }
    shortenUrlRequest(url, alias)
    .then(res => {
      console.log(res);
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <meta
          name="description"
          content="A tool to shorten a long URL into something shorter and friendlier"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form>
          <input type="text" placeholder="Shorten a URL" onChange={onChangeUrl} value={url} />
          <input type="text" placeholder="Optional alias" onChange={onChangeAlias} value={alias} />
          <button type="button" onClick={onSubmit}>Shorten URL</button>
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&amp;utm_medium=default-template&amp;utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
