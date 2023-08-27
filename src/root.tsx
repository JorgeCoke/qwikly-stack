import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/layout/router-head";

import "./global.css";
import { SiteConfig } from "./lib/site-config";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <title>{SiteConfig.title}</title>
        <meta name="description" content={SiteConfig.description} />
        <meta name="application-name" content={SiteConfig.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content={SiteConfig.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Add web to Homescreen (PWA) */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={SiteConfig.title} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="icon" type="image/png" href="/icon-512x512.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/icon-512x512.png"
        />

        {/* Opengraph meta */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.ORIGIN} />
        <meta property="og:site_name" content={SiteConfig.title} />
        <meta property="og:title" content={SiteConfig.title} />
        <meta property="og:description" content={SiteConfig.description} />
        <meta property="og:image" content="/icon-512x512.png" />

        {/* Twitter (X) meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@site" />
        <meta name="twitter:creator" content="@creator" />
        <meta name="twitter:title" content={SiteConfig.title} />
        <meta name="twitter:description" content={SiteConfig.description} />
        <meta name="twitter:image" content="/icon-512x512.png" />

        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
