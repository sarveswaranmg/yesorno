import "./App.css";
import { useRef, useEffect, useState } from "react";
import yesImg from "./assets/yes.webp";
function RoseShower() {
  return (
    <div className="rose-container">
      {Array.from({ length: 40 }).map((_, i) => {
        const startRotation = Math.random() * 360;
        const rotateDirection = Math.random() > 0.5 ? 1 : -1;

        return (
          <span
            key={i}
            className="rose"
            style={{
              left: Math.random() * 85 + "vw",
              top: "-10vh",
              animationDelay: `-${Math.random() * 10}s`,
              animationDuration: 6 + Math.random() * 6 + "s",
              "--start-rotate": `${startRotation}deg`,
              "--rotate-dir": rotateDirection,
            }}
          >
            🌹
          </span>
        );
      })}
    </div>
  );
}

function App() {
  const noBtnRef = useRef(null);
  const movingRef = useRef(false);
  const [yes, setYes] = useState(false);
  const moveNoButton = (clientX, clientY) => {
    const btn = noBtnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    const dx = btnX - clientX;
    const dy = btnY - clientY;
    const angle = Math.atan2(dy, dx);

    const moveDistance = 200;

    btn.style.transform = `translate(
      ${Math.cos(angle) * moveDistance}px,
      ${Math.sin(angle) * moveDistance}px
    )`;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (yes) return;
      if (movingRef.current) return;

      const btn = noBtnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);

      if (distance < 140) {
        movingRef.current = true;
        moveNoButton(e.clientX, e.clientY);

        setTimeout(() => {
          movingRef.current = false;
        }, 220);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [yes]);

  return (
    <>
      {yes && <RoseShower />}
      <div className={`wrapper ${yes ? "celebrate" : ""}`}>
        <div className="question">
          <p>Will You be my Valentine? 💘</p>
        </div>
        {!yes && (
          <div className="buttons">
            <button className="button yes" onClick={() => setYes(true)}>
              Yes
            </button>
            <button
              className="button no"
              ref={noBtnRef}
              onClick={(e) =>
                moveNoButton(
                  e.touches ? e.touches[0].clientX : e.clientX,
                  e.touches ? e.touches[0].clientY : e.clientY,
                )
              }
              onTouchStart={(e) =>
                moveNoButton(e.touches[0].clientX, e.touches[0].clientY)
              }
            >
              No
            </button>
          </div>
        )}
        {yes && (
          <div className="celebration">
            <img src={yesImg}></img>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
