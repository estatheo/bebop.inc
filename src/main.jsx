import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { loreMessages } from './loreMessages';
import { exchangeMineralsForCredit, exchangeScrapForCredit } from './gameLogic';
import { MiniGame } from './MiniGame.jsx';
import { Upgrades } from './Upgrades.jsx';

const load = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [location, setLocation] = useState(() => localStorage.getItem('location') || 'base');
  const [resources, setResources] = useState(() =>
    load('resources', { mineral: 0, credit: 0, ice: 0, gas: 0, rareMetal: 0, scrap: 0 })
  );
  const [drones, setDrones] = useState(() => load('drones', 0));
  const [lore, setLore] = useState(() => load('lore', [loreMessages.start]));
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(() => load('upgrades', []));

  useEffect(() => localStorage.setItem('location', location), [location]);
  useEffect(() => localStorage.setItem('resources', JSON.stringify(resources)), [resources]);
  useEffect(() => localStorage.setItem('drones', drones), [drones]);
  useEffect(() => localStorage.setItem('lore', JSON.stringify(lore)), [lore]);
  useEffect(() => localStorage.setItem('upgrades', JSON.stringify(unlocked)), [unlocked]);

  useEffect(() => {
    if (drones > 0) {
      const id = setInterval(() => {
        setResources(r => ({ ...r, mineral: r.mineral + drones }));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [drones]);

  const travel = dest => {
    setLocation(dest);
    const key = `travel_${dest}`;
    setLore(l => [...l, loreMessages[key] || `Travelled to ${dest}.`]);
  };

  const returnBase = () => {
    setLocation('base');
    setLore(l => [...l, loreMessages.returnBase]);
  };

  const handleMiniComplete = result => {
    setPlaying(false);
    if (result.success) {
      const map = { asteroid: 'mineral', iceField: 'ice', gasCloud: 'gas', rareMetalAsteroid: 'rareMetal' };
      const type = map[location];
      setResources(r => ({
        ...r,
        [type]: r[type] + 1,
        scrap: r.scrap + (result.enemyDefeated ? 1 : 0),
      }));
      let message = `You mined 1 ${type}.`;
      if (result.enemyDefeated) message += ' Enemy destroyed, scrap recovered.';
      setLore(l => [...l, message]);
    } else {
      setLore(l => [...l, 'Mining failed.']);
    }
  };

  const trade = () => {
    setResources(r => {
      const updated = exchangeMineralsForCredit(r);
      if (updated !== r) setLore(l => [...l, loreMessages.trade]);
      return updated;
    });
  };

  const tradeScrap = () => {
    setResources(r => {
      const updated = exchangeScrapForCredit(r);
      if (updated !== r) setLore(l => [...l, 'Traded scrap for credits.']);
      return updated;
    });
  };

  const buyDrone = () => {
    if (resources.credit >= 5) {
      setResources(r => ({ ...r, credit: r.credit - 5 }));
      setDrones(d => d + 1);
      setLore(l => [...l, loreMessages.droneBought]);
    }
  };

  const oxygen = 5 + (unlocked.includes('oxygen1') ? 5 : 0);
  const laserPower = 1 + (unlocked.includes('laser1') ? 1 : 0);
  const hasBlaster = unlocked.includes('blaster');

  const actions = [];
  if (location === 'base') {
    actions.push(<button key="toAst" onClick={() => travel('asteroid')}>Travel to Asteroid</button>);
    actions.push(<button key="toIce" onClick={() => travel('iceField')}>Travel to Ice Field</button>);
    actions.push(<button key="toGas" onClick={() => travel('gasCloud')}>Travel to Gas Cloud</button>);
    actions.push(<button key="toRare" onClick={() => travel('rareMetalAsteroid')}>Travel to Rare Metal Asteroid</button>);
    actions.push(<button key="trade" onClick={trade} disabled={resources.mineral < 10}>Exchange 10 Minerals for 1 Credit</button>);
    actions.push(
      <button key="tradeScrap" onClick={tradeScrap} disabled={resources.scrap < 5}>
        Exchange 5 Scrap for 1 Credit
      </button>
    );
    actions.push(<button key="drone" onClick={buyDrone} disabled={resources.credit < 5}>Buy Drone (5 credits)</button>);
    actions.push(<button key="up" onClick={() => setLocation('upgrades')}>View Upgrades</button>);
  } else if (location === 'upgrades') {
    // upgrade screen handled separately
  } else {
    if (!playing) {
      actions.push(<button key="mine" onClick={() => setPlaying(true)}>Start Mining</button>);
      actions.push(<button key="return" onClick={returnBase}>Return to Base</button>);
    }
  }

  return (
    <>
      <section className="resources">
        <div>Minerals: {resources.mineral}</div>
        <div>Credits: {resources.credit}</div>
        <div>Ice: {resources.ice}</div>
        <div>Gas: {resources.gas}</div>
        <div>Rare Metals: {resources.rareMetal}</div>
        <div>Scrap: {resources.scrap}</div>
        <div>Drones: {drones}</div>
      </section>
      <section className="actions">
        {location === 'upgrades'
          ? <Upgrades resources={resources} setResources={setResources} unlocked={unlocked} setUnlocked={setUnlocked} onClose={returnBase} />
          : (playing ? <MiniGame oxygen={oxygen} laserPower={laserPower} hasBlaster={hasBlaster} onComplete={handleMiniComplete} /> : actions)}
      </section>
      <section className="lore log">
        {lore.slice(-5).map((line, i) => (<p key={i}>{line}</p>))}
      </section>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
