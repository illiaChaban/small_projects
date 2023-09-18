import {
  onMount,
  type Component,
  type JSX,
  onCleanup,
  createEffect,
  createMemo,
  splitProps,
} from "solid-js";

import logo from "./logo.svg";
import s from "./App.module.css";
import { css, styled, keyframes } from "solid-styled-components";
import { isDefined, useAtom, useEvent } from "./utils";
import { pipeWith as p } from "pipe-ts";
import _ from "lodash/fp";
import { findIndex, toArray, throttle } from "lodash/fp";
import { Dynamic } from "solid-js/web";
import { isFunction } from "lodash";
import { tw } from "./utils/tw";

const App: Component = () => {
  document.body.style.setProperty("--scroll-y", String(window.scrollY));

  // document.body.style.setProperty(
  //   "--scroll-y-px",
  //   "calc(var(--scroll-y) * 1px)"
  // );

  useEvent("scroll", (e) => {
    // pipeWith(
    //   window.scrollY / (document.body.offsetHeight - window.innerHeight),
    //   _.tap((v) => console.log({ scroll: v })),
    //   String,
    //   (v) => document.body.style.setProperty("--scroll", v)
    // );

    p(
      window.scrollY,
      Math.round,
      // _.tap((v) => console.log({ scrollY: v })),
      String,
      (v) => document.body.style.setProperty("--scroll-y", v)
    );
  });

  return (
    <div
      class={cx(
        s.app
        // css`
        //   position: relative;
        // `
      )}
    >
      <div
        class={tw`
          flex flex-col justify-center items-center
          py-12 sticky top-[-24px]
          animate-fadeOut
          animation-reversed
          [animation-duration:0.4s]
        `}
      >
        <div class="text-[1.3rem]/[1.3rem]">Marietta</div>
        <div
          class={cx(
            tw`
              top-[74px] absolute 
              animate-fadeOut animation-reversed animation-paused
            `
          )}
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 120) / 45 * -1s, 0s)"
        >
          23° | Partly Cloudy
        </div>

        <div
          class={tw`
            text-[5rem]/[5rem] pb-2.5 
            animate-fadeOut animation-paused
          `}
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 95) / 40 * -1s, 0s)"
        >
          23
        </div>
        <div
          class="animate-fadeOut animation-paused"
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 65) / 40 * -1s, 0s)"
        >
          Partly Cloudy
        </div>
        <div
          class="animate-fadeOut animation-paused"
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 45) / 40 * -1s, 0s)"
        >
          H:35° L:21°
        </div>
      </div>

      <div class="flex flex-col gap-2.5">
        <HourlyWeatherWidget />
        <TenDayForcastWidget />
        <TenDayForcastWidget />
      </div>
    </div>
  );
};

type Falsy = false | null | undefined | 0 | "";
const isFalsy = <T,>(v: T): v is Extract<T, Falsy> =>
  [false, undefined, null, 0, ""].includes(v as any);

const comfortableTemp = [14, 21];
const Progress = ({ low, high }: { low: number; high: number }) => {
  const toPercent = (num: number) => Math.round(clamp(0, 100)(num * 100));
  const fullRange = high - low;
  const start = toPercent((comfortableTemp[0] - low) / fullRange);
  const end = toPercent((comfortableTemp[1] - low) / fullRange);
  return (
    <div
      class={cx(
        tw`h-1 bg-trasparent relative`,
        css`
          &:after {
            content: "";
            left: ${String(start)}%;
            width: ${String(end - start)}%;
            height: 100%;
            position: absolute;
            background: yellow;
          }
        `
      )}
    />
  );
};

const WidgetTitle = tw("div")`
  text-[0.8rem]
  uppercase
  text-trasparent
`;

const HourlyWeatherWidget = () => (
  <Widget
    title={
      <div class="relative">
        <WidgetTitle
          class="animate-fadeOut animation-reversed animation-paused"
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 180) / 40 * -1s, 0s)"
        >
          Hourly forecast
        </WidgetTitle>
        <div
          class={tw`
            text-[0.85rem] absolute top-0 w-full
            animate-fadeOut animation-paused
          `}
          style="animation-delay: clamp(-1s, (var(--scroll-y) - 160) / 30 * -1s, 0s)"
        >
          Clear conditions tonight, continuing throughout the morning. Wind
          gusts are up to 11 mph.
          <hr class="mt-[14px] mr-[-14px]" />
        </div>
      </div>
    }
  >
    <div class="no-scrollbar pt-3 mx-[-14px] overflow-x-auto">
      <div class="flex gap-4 p-3.5 pr-0">
        {[23, 24, 24, 24, 23, 22, 21, 20, 18, 17, 16, 15, 14].map(
          (temperature, i) => (
            <div class="flex flex-col justify-center items-center gap-2">
              <div>{i === 0 ? "Now" : (i + 16) % 24}</div>
              <div>{temperature}</div>
            </div>
          )
        )}
        {/* hack to add more padding on the right */}
        <div class="pl-[1px] ml-[-1px]" />
      </div>
    </div>
  </Widget>
);

const TenDayForcastWidget = () => (
  <Widget title={<WidgetTitle>10-day forcast</WidgetTitle>}>
    {[
      { time: "Today", low: 11, high: 24 },
      { time: "Mon", low: 13, high: 24 },
      { time: "Tue", low: 12, high: 23 },
      { time: "Wed", low: 12, high: 23 },
      { time: "Thu", low: 11, high: 20 },
      { time: "Fri", low: 10, high: 22 },
      { time: "Sat", low: 8, high: 17 },
      { time: "Sun", low: 8, high: 15 },
      { time: "Mon", low: 12, high: 24 },
      { time: "Tue", low: 12, high: 23 },
      { time: "Wed", low: 12, high: 23 },
      { time: "Thu", low: 11, high: 20 },
    ].map((x, i, arr) => (
      <div
        class={tw`
            grid grid-flow-col grid-cols-[1fr_1fr_4fr_1fr] columns-4
            gap-2.5 items-center py-2 relative
            before:content-[""] before:absolute 
            before:top-0 before:inset-x-0 before:h-[0.5px]
            before:bg-trasparent
          `}
      >
        <Centered>{x.time}</Centered>
        <Centered>{x.low}</Centered>
        <Progress low={x.low} high={x.high} />
        <Centered>{x.high}</Centered>
      </div>
    ))}
  </Widget>
);

const clamp = (min: number, max: number) => (num: number) =>
  Math.max(Math.min(num, max), min);

const Centered = tw("div")`flex justify-center items-center`;

const Widget = ({
  title,
  children,
}: {
  title: JSX.Element;
  children: JSX.Element;
}) => {
  const backdropStyles = css`
    backdrop-filter: blur(10px);
    background: rgba(65, 65, 65, 0.21);
  `;

  const paddingStyles = css`
    padding: 14px;
  `;

  let containerRef = ref<HTMLDivElement>();
  let headerRef = ref<HTMLDivElement>();
  let contentRef = ref<HTMLDivElement>();

  const values$ = useAtom<{
    height: number;
    headerHeight: number;
    maxOffset: number;
  }>();

  const idx$ = useAtom<number>();

  const stickyPosition = 90;

  const mounted$ = () => !!values$();

  // createEffect(() => console.log(values$()));
  onMount(() => {
    p(
      document.querySelectorAll("[data-role=widget]"),
      toArray,
      findIndex((v) => v === containerRef),
      idx$
    );

    values$({
      height: containerRef.offsetHeight,
      headerHeight: headerRef.offsetHeight,
      maxOffset: p(
        window.scrollY +
          containerRef.getBoundingClientRect().top -
          stickyPosition,
        Math.round
      ),
    });
  });

  const styles$ = () =>
    p(values$(), (v) =>
      v
        ? css`
            --height: ${String(v.height)};
            --header-height: ${String(v.headerHeight)};
            --container-height: ${String(v.height - v.headerHeight)};
            --max-offset: ${String(v.maxOffset)};
            --scroll-offset: min(0, var(--max-offset) - var(--scroll-y));
            --header-offset-coefficient: clamp(
              -1,
              (var(--container-height) + var(--scroll-offset)) /
                var(--header-height),
              0
            );
            height: calc(var(--height) * 1px);
          `
        : ""
    );

  // const props = [
  //   "--height",
  //   "--header-height",
  //   "--container-height",
  //   "--max-offset",
  //   "--scroll-offset",
  //   "--header-offset-coefficient",
  // ];
  // window.getCssVarValue = (names: string[] = props, index: number = 0) => {
  //   const widget: HTMLDivElement = pipeWith(
  //     document.querySelectorAll("[data-role=widget]"),
  //     toArray,
  //     (v) => v[index]
  //   );
  //   pipeWith(
  //     getComputedStyle(widget),
  //     (s) => names.map((n) => [n, s.getPropertyValue(n)]),
  //     Object.fromEntries,
  //     (v) => console.log(index, v)
  //   );
  // };

  return (
    <div
      ref={containerRef}
      data-role="widget"
      class={cx(
        styles$(),
        css`
          backdrop-filter: blur(10px);
        `
      )}
      classList={{
        [css`
          position: sticky;
          top: ${String(stickyPosition)}px;
          opacity: 0;
          animation: ${revealAnimation} 0.5s forwards;
        `]: mounted$(),
        [css`
          animation-delay: ${p(idx$() ?? 0, (v) => v / 7, String)}s;
        `]: isDefined(idx$()),
      }}
    >
      <div
        class={cx(
          backdropStyles,
          tw`text-white rounded-[10px]`,
          css`
            max-height: calc(
              max(var(--header-height), var(--height) + var(--scroll-offset)) *
                1px
            );
            /* &::after {
              content: "";
              position: absolute;
              width: 100px;
              height: calc(-45px * var(--header-offset-coefficient));
              background: red;
              top: 0;
            } */
            opacity: clamp(0, 1.2 + var(--header-offset-coefficient) * 1.5, 1);
          `
        )}
      >
        <div
          ref={headerRef}
          class={cx(
            paddingStyles,
            tw`rounded-t-[10px]`,
            css`
              /* position: sticky;
            top: 90px; */

              /* z-index: 1; */
              /* &::after {
              content: "";
              position: absolute;
              width: calc(100% - 14px * 2);
              height: 1px;
              left: 14px;
              bottom: 0;
              background: var(--color-transparent);
              z-index: 2;
            } */
            `
          )}
        >
          {title}
        </div>

        <div class="overflow-y-clip">
          <div
            ref={contentRef}
            class={cx(
              tw`px-3.5 relative`,
              // paddingStyles,
              css`
                transform: translateY(calc(var(--scroll-offset) * 1px));
              `
              // css`
              //   transform: translateY(-40px);
              // `,
              // css`
              //   border-bottom-right-radius: 10px;
              //   border-bottom-left-radius: 10px;
              // `
              // css`
              //   clip-path: inset(calc(var(--scroll-y) * 1px - 176px) 0 0 0);
              // `
            )}
          >
            {/* <hr
              class={css`
                margin: 0 0 14px;
                position: absolute;
                top: 0;
                width: calc(100% - 14px * 2);
                height: 1px;
                left: 14px;
                z-index: 1;
              `}
            /> */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const revealAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    /* scale: 1; */
    transform: translateY(0);
  }
`;

// const WidgetV2 = (p: { rows: number; title: JSX.Element }) => {
//   return (
//     <div>
//       <div>{p.title}</div>
//       <div>
//         {range(p.rows).map((x) => (
//           <div>Hello</div>
//         ))}
//       </div>
//     </div>
//   );
// };

const ref = <T extends any = HTMLElement>(): T => null as any as T;

const cx = (...styles: string[]) => styles.join(" ");

export default App;
