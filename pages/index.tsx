import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

import styles from '../styles/home.module.scss';

const shortenUrlRequest = (url: string, alias?: string) => {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/urls`;
  const requestBody: any = {
    url,
  };
  if (alias) {
    requestBody.alias = alias;
  }

  return fetch(requestUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => {
    if (!res.ok) {
      return res.json().then(e => {
        return Promise.reject(e);
      });
    }
    return res.json();
  });
};

const Home: NextPage = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const onChangeUrl = (event: React.FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };

  const onChangeAlias = (event: React.FormEvent<HTMLInputElement>) => {
    setAlias(event.currentTarget.value);
  };

  const clearShortenedUrl = () => {
    setShortenedUrl('');
  };

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      alert('Clipboard is not supported');
      return;
    }

    const element = document.getElementById('shortened-url');
    const shortenedUrl = element?.innerText;

    if (shortenedUrl) {
      navigator.clipboard
        .writeText(shortenedUrl)
        .then(() => {
          alert(`Copied "${shortenedUrl}" to the clipboard!`);
        })
        .catch(alert);
    }
  };

  const onSubmit = () => {
    if (!url) {
      alert('Please enter a URL to be shortened');
      return;
    }
    shortenUrlRequest(url, alias)
      .then(res => {
        setShortenedUrl(res.payload);
      })
      .catch(e => {
        clearShortenedUrl();
        alert(e.error.message);
      });
  };

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
        <p>
          Enter a URL to be shortened(Include http/https), e.g.{' '}
          <code>https://google.com</code>
        </p>

        <form className={styles.form}>
          <input
            type="text"
            placeholder="Shorten a URL"
            onChange={onChangeUrl}
            value={url}
          />
          <input
            type="text"
            placeholder="Optional alias"
            onChange={onChangeAlias}
            value={alias}
          />
          <button
            type="button"
            onClick={onSubmit}
            className={styles.submitButton}
          >
            Shorten URL
          </button>
        </form>

        {shortenedUrl && (
          <div className={styles.shortenedUrlContainer}>
            <p>
              Shortened URL: <span id="shortened-url">{shortenedUrl}</span>
            </p>
            <button type="button" onClick={copyToClipboard}>
              Copy to clipboard
            </button>
          </div>
        )}
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
