import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { loreMessages } from './loreMessages';

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
  const [resources, setResources] = useState(() => load('resources', { metal: 0, crystal: 0, fuel: 0 }));
  const [attributes, setAttributes] = useState(() => load('attributes', {
    miningEfficiency: 1,
    movementSpeed: 1,
    cargoCapacity: 50,
  }));
  const [lore, setLore] = useState(() => load('lore', [loreMessages.start]));
  const [mining, setMining] = useState(false);

  useEffect(() => {
    localStorage.setItem('location', location);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('attributes', JSON.stringify(attributes));
  }, [attributes]);

  useEffect(() => {
    localStorage.setItem('lore', JSON.stringify(lore));
  }, [lore]);

  const travel = () => {
    setLocation('asteroid');
    setLore(l => [...l, loreMessages.travelAsteroid]);
  };

  const returnBase = () => {
    setLocation('base');
    setLore(l => [...l, loreMessages.returnBase]);
  };

  const mine = () => {
    if (mining) return;
    setMining(true);
    const delay = 1000 / attributes.miningEfficiency;
    setTimeout(() => {
      const types = ['metal', 'crystal', 'fuel'];
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = attributes.miningEfficiency;
      setResources(r => {
        const total = r.metal + r.crystal + r.fuel;
        if (total + amount > attributes.cargoCapacity) {
          setLore(l => [...l, loreMessages.cargoFull]);
          setMining(false);
          return r;
        }
        return { ...r, [type]: r[type] + amount };
      });
      setLore(l => [...l, `You mined ${amount} ${type}.`]);
      setMining(false);
    }, delay);
  };

  const upgradeMining = () => {
    if (resources.metal >= 10) {
      setResources(r => ({ ...r, metal: r.metal - 10 }));
      setAttributes(a => ({ ...a, miningEfficiency: a.miningEfficiency + 1 }));
      setLore(l => [...l, loreMessages.upgradeTools]);
      checkForeshadowing();
    }
  };

  const upgradeMovement = () => {
    if (resources.fuel >= 5) {
      setResources(r => ({ ...r, fuel: r.fuel - 5 }));
      setAttributes(a => ({ ...a, movementSpeed: a.movementSpeed + 1 }));
      setLore(l => [...l, loreMessages.upgradeMovement]);
      checkForeshadowing();
    }
  };

  const upgradeCargo = () => {
    if (resources.crystal >= 5) {
      setResources(r => ({ ...r, crystal: r.crystal - 5 }));
      setAttributes(a => ({ ...a, cargoCapacity: a.cargoCapacity + 20 }));
      setLore(l => [...l, loreMessages.upgradeCargo]);
      checkForeshadowing();
    }
  };

  const checkForeshadowing = () => {
    if (!lore.some(line => line.includes('whisper'))) {
      setLore(l => [...l, loreMessages.foreshadow]);
    }
  };

  const actions = [];
  if (location === 'base') {
    actions.push(<button key="travel" onClick={travel}>Travel to Asteroid</button>);
  } else if (location === 'asteroid') {
    actions.push(<button key="mine" onClick={mine} disabled={mining}>Mine Asteroid</button>);
    actions.push(<button key="return" onClick={returnBase}>Return to Base</button>);
  }

  const upgrades = [
    { key: 'upMine', label: 'Upgrade Tools (10 metal)', onClick: upgradeMining, disabled: resources.metal < 10 },
    { key: 'upMove', label: 'Upgrade Movement (5 fuel)', onClick: upgradeMovement, disabled: resources.fuel < 5 },
    { key: 'upCargo', label: 'Upgrade Cargo (5 crystal)', onClick: upgradeCargo, disabled: resources.crystal < 5 },
  ];

  return (
    <div className="container">
      <div className="resources">
        <div>Metal: {resources.metal}</div>
        <div>Crystal: {resources.crystal}</div>
        <div>Fuel: {resources.fuel}</div>
      </div>
      <div className="attributes">
        <div>Mining Efficiency: {attributes.miningEfficiency}</div>
        <div>Movement Speed: {attributes.movementSpeed}</div>
        <div>Cargo Capacity: {attributes.cargoCapacity}</div>
      </div>
      <div className="actions">
        {actions}
        {upgrades.map(u => (
          <button key={u.key} onClick={u.onClick} disabled={u.disabled}>{u.label}</button>
        ))}
      </div>
      <div className="lore">
        {lore.slice(-5).map((line, i) => (<p key={i}>{line}</p>))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
