import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import InstagramIcon from "~/components/icons/instagram-icon";
import LucideChevronsRight from "~/components/icons/lucide-chevrons-right";
import LucideStar from "~/components/icons/lucide-star";
import LucideStarHalf from "~/components/icons/lucide-star-half";
import QwikLogo from "~/components/icons/qwik-logo";
import TikTokIcon from "~/components/icons/tiktok-icon";
import YoutubeIcon from "~/components/icons/youtube-icon";
import { ThreeJsScene } from "~/components/layout/threejs-scene";
import { AnchorButton } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import { Gradient, H0, H1, H2, H3, H5 } from "~/components/ui/typography";

export default component$(() => {
  const showThreeJsScene = useSignal<boolean>(false);

  useVisibleTask$(() => {
    // NOTE: sm screens: https://tailwindcss.com/docs/screens
    if (window.innerWidth > 640) {
      showThreeJsScene.value = true;
    }
  });

  const features = [
    {
      title: "Qwik",
      body: (
        <>
          Latest features from{" "}
          <a
            aria-label="Qwik homepage"
            href="https://qwik.builder.io/"
            target="_blank"
            rel="noreferrer"
            class="font-bold underline underline-offset-4"
          >
            <Gradient>Qwik</Gradient>
          </a>
          , the fastest Javascript framework available
        </>
      ),
    },

    {
      title: "Full-stack Typesafety",
      body: (
        <>
          Full-stack typesafety with{" "}
          <a
            aria-label="Module forms homepage"
            href="https://qwik.builder.io/docs/integrations/modular-forms/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>Modular Forms</Gradient>
          </a>{" "}
          , and{" "}
          <a
            aria-label="Zod homepage"
            href="https://zod.dev/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>zod</Gradient>
          </a>
          . Typesafe database querying using{" "}
          <a
            aria-label="DrizzleORM homepage"
            href="https://orm.drizzle.team/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>DrizzleORM</Gradient>
          </a>
        </>
      ),
    },
    {
      title: "TailwindCSS",
      body: (
        <>
          Build all the components you need for your next application with{" "}
          <a
            aria-label="TailwindCSS homepage"
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>TailwindCSS</Gradient>
          </a>
        </>
      ),
    },
    {
      title: "Authentication",
      body: (
        <>
          Protect pages and API routes throughout your entire app easly thanks
          to{" "}
          <a
            aria-label="Lucia Auth homepage"
            href="https://lucia-auth.com/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>Lucia Auth</Gradient>
          </a>
        </>
      ),
    },
    {
      title: "MDX",
      body: (
        <>
          Preconfigured{" "}
          <a
            aria-label="MDX homepage"
            href="https://qwik.builder.io/docs/guides/mdx/#mdx"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>MDX Support</Gradient>
          </a>
          . MDX is the best way to write contentful pages.
        </>
      ),
    },
    {
      title: "Payments",
      body: (
        <>
          Accept single payments and recurring subscriptions with{" "}
          <a
            aria-label="Stripe homepage"
            href="https://www.stripe.com/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>Stripe</Gradient>
          </a>
        </>
      ),
    },
    {
      title: "Mailing",
      body: (
        <>
          Send any kind of mail with{" "}
          <a
            aria-label="Resend homepage"
            href="https://resend.com/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>Resend</Gradient>
          </a>{" "}
          platform
        </>
      ),
    },
    {
      title: "Three.js",
      body: (
        <>
          Outstanding 3D websites with{" "}
          <a
            aria-label="Three.js homepage"
            href="https://threejs.org/"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            <Gradient>Three.js</Gradient>
          </a>
        </>
      ),
    },
    {
      title: "Fully customizable",
      body: <>Feel free to add/remove whatever technology you want</>,
    },
  ];

  const steps = [
    {
      title: "Set up",
      description:
        "Just install dependencies and create your Stripe and Resend accounts",
    },
    {
      title: "Develop",
      description:
        "Start developing your dreamed new features, all under a typesafe environment",
    },
    {
      title: "Deploy",
      description:
        "Deploy it to your preffered host, just follow any Qwik adapter guide and everything should work as expected",
    },
    {
      title: "Enjoy!",
      description:
        "See you on production, I hope you get your first client, good luck!",
    },
  ];

  const trusted = [
    {
      name: "A. Skywalker",
      image: "/customer1.jpg",
      testimonial: "Great template! I'm in love with it",
      rating: (
        <>
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
        </>
      ),
    },
    {
      name: "L. Organa",
      image: "/customer2.jpg",
      testimonial: "I can not use anything else",
      rating: (
        <>
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
        </>
      ),
    },
    {
      name: "O.W. Kenobi",
      image: "/customer3.jpg",
      testimonial: "May the stack be with you",
      rating: (
        <>
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStar class="h-4 w-4 fill-amber-200 text-amber-400" />
          <LucideStarHalf class="h-4 w-4  fill-amber-200 text-amber-400" />
        </>
      ),
    },
  ];

  return (
    <section class="container  py-12">
      {showThreeJsScene.value && <ThreeJsScene color="#aaa" />}
      <div class="relative z-10 mx-auto max-w-[85rem] space-y-10 py-12">
        <QwikLogo class="mx-auto h-24" />
        <div class="mx-auto max-w-3xl text-center">
          <H0>
            Now it's easier than ever to <Gradient>build products</Gradient>
          </H0>
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <H5>
            The qwikest delightful, overpowered, beautifully handcrafted
            full-stack web framework template, built on top of Qwik, seasoned
            with modern tools
          </H5>
        </div>

        <div class="text-center">
          <AnchorButton
            aria-label="GetStarted button"
            class=" rounded-full bg-gradient-to-tl from-blue-600 to-violet-600 px-6 py-3  font-bold  text-white shadow-lg hover:shadow-blue-700/50  dark:text-white "
            href="/auth/log-in"
          >
            GET STARTED
          </AnchorButton>
        </div>
        <div class="flex justify-center">
          <div class="group flex cursor-pointer items-center justify-between gap-4 rounded-full border border-white/[.7] bg-white p-1 px-4 pl-4 text-sm text-slate-700 shadow-md hover:bg-white/[.4] dark:border-white/[.05] dark:bg-white/[.05] dark:text-slate-300 dark:hover:bg-white/[.1]">
            <span>Open Source, and Edge Runtime ready!</span>
            <LucideChevronsRight />
          </div>
        </div>
      </div>
      <div class="mx-auto flex max-w-5xl flex-col items-center gap-8 border-t border-slate-300 py-12 align-middle dark:border-slate-500">
        <H1 class="text-center">What&apos;s included?</H1>

        <H5 class="max-w-3xl text-center">
          This repo comes fully stacked with everything you need for your
          enterprise startup. Stop worrying about boilerplate integrations and
          start building your product today!
        </H5>

        <div class="grid grid-cols-1 gap-5 pt-12 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} class="p-6">
              <H3 class="font-semibold">{feature.title}</H3>
              <H5 class="text-sm font-light">{feature.body}</H5>
            </Card>
          ))}
        </div>
      </div>
      <div class="flex flex-col py-12">
        <div class="mb-10 max-w-xl sm:text-center md:mx-auto md:mb-12 lg:max-w-2xl">
          <div>
            <p class="my-6 inline-block rounded-full bg-white p-4 py-px text-xs font-extrabold dark:bg-slate-100 ">
              <Gradient>BRAND NEW</Gradient>
            </p>
          </div>
          <H2 class="mb-6">
            <span class="relative inline-block">
              <svg
                viewBox="0 0 52 24"
                fill="currentColor"
                class="text-blue-gray-100 absolute left-0 top-0 z-0 -ml-20 -mt-8 hidden w-32 sm:block lg:-ml-28 lg:-mt-10 lg:w-32"
              >
                <defs>
                  <pattern
                    id="d0d83814-78b6-480f-9a5f-7f637616b267"
                    x="0"
                    y="0"
                    width=".135"
                    height=".30"
                  >
                    <circle cx="1" cy="1" r=".7" />
                  </pattern>
                </defs>
                <rect
                  fill="url(#d0d83814-78b6-480f-9a5f-7f637616b267)"
                  width="51"
                  height="24"
                />
              </svg>
              <span class="relative">The</span>
            </span>{" "}
            fastest, and easiest stack over the planet
          </H2>
          <H5 class="max-w-3xl text-center">
            Install dependencies, set up environment variables, connect your
            stripe account and you are ready to go!
          </H5>
        </div>
        <div class="row-gap-5 md:row-gap-8 relative mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div class="absolute inset-0 flex items-center justify-center sm:hidden lg:flex">
            <div class="h-full w-px bg-slate-500 lg:h-px lg:w-full" />
          </div>
          {steps.map((step, index) => (
            <Card
              key={index}
              class="transform p-5 shadow-sm duration-300 hover:-translate-y-2"
            >
              <div class="mb-2 flex items-center justify-between text-black dark:text-white">
                <p class="text-lg font-bold leading-5">{step.title}</p>
                <p class="text-deep-slate-accent-400 flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tl from-blue-600 to-violet-600 font-bold text-white">
                  {index}
                </p>
              </div>
              <H5 class="text-sm">{step.description}</H5>
            </Card>
          ))}
        </div>
      </div>
      <div class="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-4 py-12">
        <H1 class="pb-8 text-center">
          Trusted by <Gradient>our clients</Gradient>
        </H1>

        <div class="grid gap-y-10 divide-slate-400 dark:divide-slate-500 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:divide-x">
          {trusted.map((e, index) => (
            <div
              key={index}
              class="flex flex-col items-center gap-4 text-black dark:text-white sm:px-4 md:gap-6 lg:px-8"
            >
              <div class="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                <div class="h-12 w-12 overflow-hidden rounded-full bg-slate-700 shadow-lg md:h-14 md:w-14">
                  <img
                    src={e.image}
                    width="250"
                    height="250"
                    alt={e.name}
                    class="h-full w-full object-cover object-center"
                  />
                </div>
                <div>
                  <div class="text-center text-sm font-bold sm:text-left md:text-base">
                    {e.name}
                  </div>
                  <div class="flex">{e.rating}</div>
                </div>
              </div>
              <H5 class="text-center">{e.testimonial}</H5>
            </div>
          ))}
        </div>
      </div>
      <div class="mx-auto flex flex-col gap-5 py-12">
        <H5 class=" text-center text-sm">AS SEEN ON</H5>
        <div class="flex flex-col items-center justify-center gap-4 bg-slate-50 align-middle dark:bg-slate-950 md:flex-row md:gap-8">
          <InstagramIcon class="h-20 w-36 fill-black dark:fill-white md:h-24" />
          <TikTokIcon class="h-20 w-36 fill-black dark:fill-white md:h-24" />
          <YoutubeIcon class="h-20 w-36 fill-black dark:fill-white md:h-24" />
        </div>
      </div>
    </section>
  );
});

// See https://qwik.builder.io/docs/caching/
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};
