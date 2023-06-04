import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import githubIcon from '../images/GitHub-Mark-120px-plus.png'

import styles from '../styles/home.module.scss';

const IS_PRODUCTION_READY =
  process.env.NEXT_PUBLIC_IS_PRODUCTION_READY === 'true';
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const NEXT_PUBLIC_WEEKDAY_OPERATING_HOURS =
  process.env.NEXT_PUBLIC_WEEKDAY_OPERATING_HOURS;
const NEXT_PUBLIC_WEEKEND_OPERATING_HOURS =
  process.env.NEXT_PUBLIC_WEEKEND_OPERATING_HOURS;

const shortenUrlRequest = (url: string, alias?: string) => {
  const requestUrl = `${API_DOMAIN}/urls`;
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
  const [serverConnectionError, setServerConnectionError] = useState('');
  const [isShortening, setIsShortening] = useState(false);

  const onChangeUrl = (event: React.FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };

  const onChangeAlias = (event: React.FormEvent<HTMLInputElement>) => {
    setAlias(event.currentTarget.value);
  };

  const clearShortenedUrl = () => {
    if (shortenedUrl) {
      setShortenedUrl('');
    }
  };

  const clearServerError = () => {
    if (serverConnectionError) {
      setServerConnectionError('');
    }
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

  const getErrorMessage = (e: any): string => {
    if (e?.error?.message) {
      return e.error.message;
    }
    return e?.message;
  };

  const isServerConnectionError = (msg: string): boolean => {
    return msg?.toLowerCase().includes('failed to fetch');
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code.toLowerCase() === 'enter') {
      onSubmit();
    }
  };

  const onSubmit = () => {
    if (!url) {
      alert('Please enter a URL to be shortened');
      return;
    }
    if (isShortening) {
      return;
    }
    setIsShortening(true);
    // Good idea for UI tests. Make sure various states gets set/cleared according to the response
    shortenUrlRequest(url, alias)
      .then(res => {
        setShortenedUrl(res.payload);
        clearServerError();
      })
      .catch(e => {
        console.log(e);
        const errorMessage = getErrorMessage(e);

        if (isServerConnectionError(errorMessage)) {
          setServerConnectionError('Unable to establish connection to server');
          clearShortenedUrl();
        } else {
          console.log(errorMessage);
          clearServerError();
          alert(errorMessage);
        }
      })
      .finally(() => {
        setIsShortening(false);
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

      {!IS_PRODUCTION_READY && (
        <div className={styles.overlayMessage}>
          <p>Coming soon. Stay tuned!</p>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.operatingHours}>
          {NEXT_PUBLIC_WEEKDAY_OPERATING_HOURS && (
            <div className={styles.operatingHour}>
              Weekday operating hours: {NEXT_PUBLIC_WEEKDAY_OPERATING_HOURS}
            </div>
          )}
          {NEXT_PUBLIC_WEEKEND_OPERATING_HOURS && (
            <div className={styles.operatingHour}>
              Weekend operating hours: {NEXT_PUBLIC_WEEKEND_OPERATING_HOURS}
            </div>
          )}
        </div>

        {serverConnectionError && (
          <div className={styles.serverConnectionError}>
            {serverConnectionError}
          </div>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.github}>
          <a href="https://github.com/hanchiang" target="_blank" rel="noreferrer">
            <Image src={githubIcon} alt="Github icon" width='50px' height="50px" />
          </a>
        </div>

        <p className={styles.title}>
          Enter a URL to be shortened(Include http/https)
          <br />
          e.g. <code>https://google.com</code>
        </p>

        <form className={styles.form}>
          <input
            type="text"
            placeholder="Shorten a URL"
            onChange={onChangeUrl}
            value={url}
            onKeyPress={onKeyPress}
          />
          <input
            type="text"
            placeholder="Optional alias"
            onChange={onChangeAlias}
            value={alias}
            onKeyPress={onKeyPress}
          />
          <button
            type="button"
            onClick={onSubmit}
            className={styles.submitButton}
            disabled={isShortening}
          >
            Shorten URL
          </button>
        </form>

        {shortenedUrl && (
          <div className={styles.shortenedUrlContainer}>
            <p>
              Shortened URL:{' '}
              <a
                href={shortenedUrl}
                id="shortened-url"
                target="_blank"
                rel="noreferrer"
              >
                {shortenedUrl}
              </a>
            </p>
            <button
              className={styles.copyClipboardButton}
              type="button"
              onClick={copyToClipboard}
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span>Made by&nbsp;</span>
        <a href="https://yaphc.com" target="_blank" rel="noopener noreferrer">
          yaphc.com
        </a>        
      </footer>
    </div>
  );
};

export default Home;
