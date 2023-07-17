import type { Component, JSX } from "solid-js";

import logo from "./logo.svg";
import s from "./App.module.css";
import { css, styled, keyframes } from "solid-styled-components";
import { useEvent } from "./utils";
import { pipeWith } from "pipe-ts";
import _ from "lodash/fp";

const App: Component = () => {
  useEvent("scroll", (e) => {
    // pipeWith(
    //   window.scrollY / (document.body.offsetHeight - window.innerHeight),
    //   _.tap((v) => console.log({ scroll: v })),
    //   String,
    //   (v) => document.body.style.setProperty("--scroll", v)
    // );

    pipeWith(
      window.scrollY,
      _.tap((v) => console.log({ scrollY: v })),
      String,
      (v) => document.body.style.setProperty("--scroll-y", v)
    );
  });

  return (
    <div class={s.app}>
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
          23* | Partly Cloudy
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
          `}
        >
          23 d
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
          H:35 L:21
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

const HourlyWeatherWidget = () => (
  <Widget
    title={
      <div class={s.title1}>
        Partly cloudy conditions expected around 20:00.
      </div>
    }
  >
    <div
      class={
        css`
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
          padding-left: 14px;
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
              <div>{i === 0 ? "Now" : (i + 15) % 24}</div>
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
  <Widget title={<div class={s.title2}>10-day forcast</div>}>
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
        <div
          class={css`
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 1fr 1fr 4fr 1fr;
            column-count: 4;
            gap: 10px;
            align-items: center;
          `}
        >
          <Centered>{x.time}</Centered>
          <Centered>{x.low}</Centered>
          <Progress low={x.low} high={x.high} />
          <Centered>{x.high}</Centered>
        </div>
        {i !== arr.length - 1 && <hr />}
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
  const sharedStyles = css`
    color: white;
    backdrop-filter: blur(10px);
    background: rgba(65, 65, 65, 0.21);
    /* padding: 14px; */
  `;
  return (
    <div
      class={css`
        color: white;
        backdrop-filter: blur(10px);
        background: rgba(65, 65, 65, 0.21);
        border-radius: 10px;
        /* position: sticky;
        top: 186px; */
      `}
    >
      <div
        classList={{
          [css`
            position: sticky;
            top: 90px;
          `]: true,
        }}
      >
        <div
          classList={{
            [css`
              padding: 14px;
            `]: true,
          }}
        >
          {title}
        </div>
        <div
          class={css`
            border-bottom: 1px solid var(--color-transparent);
          `}
        />
      </div>
      <div
        classList={{
          [css`
            position: sticky;
            top: 231px;
          `]: true,
        }}
      >
        {children}
      </div>
    </div>
  );
};

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

export default App;
