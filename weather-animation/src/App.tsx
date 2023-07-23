import {
  onMount,
  type Component,
  type JSX,
  onCleanup,
  createEffect,
} from "solid-js";

import logo from "./logo.svg";
import s from "./App.module.css";
import { css, styled, keyframes } from "solid-styled-components";
import { isDefined, useAtom, useEvent } from "./utils";
import { pipeWith } from "pipe-ts";
import _ from "lodash/fp";
import { findIndex, toArray } from "lodash/fp";

const App: Component = () => {
  document.body.style.setProperty("--scroll-y", String(window.scrollY));

  document.body.style.setProperty(
    "--scroll-y-px",
    "calc(var(--scroll-y) * 1px)"
  );

  useEvent("scroll", (e) => {
    // pipeWith(
    //   window.scrollY / (document.body.offsetHeight - window.innerHeight),
    //   _.tap((v) => console.log({ scroll: v })),
    //   String,
    //   (v) => document.body.style.setProperty("--scroll", v)
    // );

    pipeWith(
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
        class={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 0;
          position: sticky;
          top: -24px;
          /* z-index: 1; */
          /* background: blue; */
          animation: ${fadeOutAnimation} 0.2s reverse;
        `}
      >
        <div
          class={css`
            font-size: 1.3rem;
            line-height: 1.3rem;
          `}
        >
          Marietta
        </div>

        <div
          class={css`
            position: absolute;
            top: 74px;
            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-direction: reverse;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 120) / 40)) * -1s
            );
          `}
        >
          23° | Partly Cloudy
        </div>

        <div
          class={css`
            font-size: 5rem;
            line-height: 5rem;
            padding-bottom: 10px;

            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 95) / 40)) * -1s
            );

            &::after {
              content: "°";
              position: absolute;
            }
          `}
        >
          23
        </div>
        <div
          class={css`
            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 65) / 40)) * -1s
            );
          `}
        >
          Partly Cloudy
        </div>
        <div
          class={css`
            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 45) / 40)) * -1s
            );
          `}
        >
          H:35° L:21°
        </div>
      </div>

      <div
        class={css`
          display: flex;
          flex-direction: column;
          gap: 10px;
        `}
      >
        <HourlyWeatherWidget />
        <TenDayForcastWidget />
        <TenDayForcastWidget />
      </div>
    </div>
  );
};

const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const comfortableTemp = [14, 21];
const Progress = ({ low, high }: { low: number; high: number }) => {
  const toPercent = (num: number) => Math.round(minMax(0, 100)(num * 100));
  const fullRange = high - low;
  const start = toPercent((comfortableTemp[0] - low) / fullRange);
  const end = toPercent((comfortableTemp[1] - low) / fullRange);
  return (
    <div
      class={css`
        height: 4px;
        background: var(--color-transparent);
        position: relative;
        &:after {
          content: "";
          left: ${String(start)}%;
          width: ${String(end - start)}%;
          height: 100%;
          position: absolute;
          background: yellow;
        }
        /* min-width: 40px; */
        /* max-width: 100px; */
      `}
    />
  );
};

const WidgetTitle = styled("div")`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-transparent);
`;

const HourlyWeatherWidget = () => (
  <Widget
    title={
      <div
        class={css`
          position: relative;
        `}
      >
        <WidgetTitle
          class={css`
            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-direction: reverse;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 180) / 40)) * -1s
            );
          `}
        >
          Hourly forecast
        </WidgetTitle>
        <div
          class={cx(css`
            font-size: 0.85rem;
            position: absolute;
            top: 0;
            width: 100%;
            animation: ${fadeOutAnimation} 1s linear forwards;
            animation-play-state: paused;
            animation-delay: calc(
              max(0, min(1, (var(--scroll-y) - 160) / 30)) * -1s
            );
          `)}
        >
          Clear conditions tonight, continuing throughout the morning. Wind
          gusts are up to 11 mph.
          <hr
            class={css`
              margin: 14px -14px 0 0;
            `}
          />
        </div>
      </div>
    }
  >
    <div
      class={
        css`
          padding-top: 12px;
          margin-left: -14px;
          margin-right: -14px;
          overflow-x: auto;
        ` + ` no-scrollbar`
      }
    >
      <div
        class={css`
          display: flex;
          gap: 16px;
          /* padding-left: 14px; */
          padding: 14px 0 14px 14px;
        `}
      >
        {[23, 24, 24, 24, 23, 22, 21, 20, 18, 17, 16, 15, 14].map(
          (temperature, i) => (
            <div
              class={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 8px;
              `}
            >
              <div>{i === 0 ? "Now" : (i + 24) % 31}</div>
              <div>{temperature}</div>
            </div>
          )
        )}
        {/* hack to add more padding on the right */}
        <div
          class={css`
            padding-left: 1px;
            margin-left: -1px;
          `}
        />
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
      <>
        {/* {i === 0 ? <hr style="position: absolute; margin-top: 0;" /> : <hr />} */}
        {/* {i !== arr.length - 1 && <hr />} */}
        <div
          class={css`
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 1fr 1fr 4fr 1fr;
            column-count: 4;
            gap: 10px;
            align-items: center;
            padding: 8px 0;
            position: relative;
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 1px;
              background-color: var(--color-transparent);
            }
          `}
        >
          <Centered>{x.time}</Centered>
          <Centered>{x.low}</Centered>
          <Progress low={x.low} high={x.high} />
          <Centered>{x.high}</Centered>
        </div>
      </>
    ))}
  </Widget>
);

const minMax = (min: number, max: number) => (num: number) =>
  Math.max(Math.min(num, max), min);

const Centered = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    pipeWith(
      document.querySelectorAll("[data-role=widget]"),
      toArray,
      findIndex((v) => v === containerRef),
      idx$
    );

    values$({
      height: containerRef.offsetHeight,
      headerHeight: headerRef.offsetHeight,
      maxOffset: pipeWith(
        window.scrollY +
          containerRef.getBoundingClientRect().top -
          stickyPosition,
        Math.round
      ),
    });
  });

  return (
    <div
      ref={containerRef}
      data-role="widget"
      classList={{
        [css`
          position: sticky;
          top: ${String(stickyPosition)}px;
          opacity: 0;
          animation: ${revealAnimation} 0.5s forwards;
        `]: mounted$(),
        [css`
          animation-delay: ${pipeWith(idx$() ?? 0, (v) => v / 7, String)}s;
        `]: isDefined(idx$()),
      }}
      style={pipeWith(values$(), (v) =>
        v
          ? `
        --height: ${v.height}px; 
        --header-height: ${v.headerHeight}px; 
        --max-offset: ${v.maxOffset}px; 
        --scroll-offset: calc(var(--scroll-y-px) - var(--max-offset));
        height: var(--height);
      `
          : ""
      )}
    >
      <div
        class={cx(
          backdropStyles,
          css`
            color: white;
            border-radius: 10px;
            /* max-height: max(
              var(--header-height),
              calc(var(--height) - max(0, var(--scroll-y-px) - 90px))
            ); */
            max-height: max(
              var(--header-height),
              var(--height) - var(--scroll-y-px) + var(--max-offset)
            );
            /* position: sticky;
        top: 90px; */
          `
        )}
      >
        <div
          ref={headerRef}
          class={cx(
            paddingStyles,
            css`
              border-top-right-radius: 10px;
              border-top-left-radius: 10px;
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

        <div
          class={cx(
            css`
              overflow-y: clip;
            `
          )}
        >
          <div
            ref={contentRef}
            class={cx(
              // paddingStyles,
              css`
                padding: 0 14px;
                position: relative;
                transform: translateY(
                  min(0px, var(--max-offset) - var(--scroll-y-px))
                );
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
