/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";

export default function (opts: RenderToStreamOptions) {
  // NOTE: Path to hide "QWIK WARN Duplicate implementations of "JSXNode" found" anoying log messages
  // See: https://github.com/BuilderIO/qwik/issues/3883#issuecomment-1575046705
  // if (isDev) {
  //   const consoleWarn = console.warn;
  //   const SUPPRESSED_WARNINGS = [
  //     'Duplicate implementations of "JSXNode" found',
  //   ];
  //   console.warn = function filterWarnings(msg, ...args) {
  //     if (
  //       !SUPPRESSED_WARNINGS.some(
  //         (entry) =>
  //           msg.includes(entry) || args.some((arg) => arg.includes(entry))
  //       )
  //     )
  //       consoleWarn(msg, ...args);
  //   };
  // }
  // END NOTE

  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
  });
}
