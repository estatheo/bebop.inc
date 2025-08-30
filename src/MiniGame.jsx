import React, { useState, useEffect, useRef } from 'react';

export function MiniGame({ oxygen, laserPower, hasBlaster, onComplete }) {
  const [oxygenLeft, setOxygenLeft] = useState(oxygen);
  const [rockHP, setRockHP] = useState(() => Math.floor(5 + Math.random() * 5));
  const enemyInitial = useRef(Math.random() < 0.3 ? Math.floor(3 + Math.random() * 3) : 0);
  const [enemyHP, setEnemyHP] = useState(enemyInitial.current);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setOxygenLeft(o => {
        const next = +(o - 0.1).toFixed(1);
        if (next <= 0) {
          clearInterval(id);
          setDone(true);
          onComplete({ success: false, enemyDefeated: false });
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [done, onComplete]);

  useEffect(() => {
    if (!done && rockHP <= 0) {
      setDone(true);
      onComplete({
        success: true,
        enemyDefeated: enemyInitial.current > 0 && enemyHP <= 0,
      });
    }
  }, [rockHP, enemyHP, done, onComplete]);

  const fire = () => {
    if (done) return;
    if (enemyHP > 0) {
      const dmg = laserPower + (hasBlaster ? 2 : 0);
      setEnemyHP(h => Math.max(0, h - dmg));
    } else {
      setRockHP(h => Math.max(0, h - laserPower));
    }
  };

  return (
    <div className="minigame">
      <div>Oxygen: {oxygenLeft.toFixed(1)}s</div>
      {enemyInitial.current > 0 && <div>Enemy HP: {enemyHP}</div>}
      <div>Rock HP: {rockHP}</div>
      <button onClick={fire}>Fire</button>
    </div>
  );
}
