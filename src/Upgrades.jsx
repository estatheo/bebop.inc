import React from 'react';
import { upgradeTree, canUnlock } from './upgradeLogic.js';

export function Upgrades({ resources, setResources, unlocked, setUnlocked, onClose }) {
  const unlock = node => {
    if (
      !canUnlock(node.id, unlocked) ||
      resources.credit < node.cost.credit ||
      resources.scrap < node.cost.scrap ||
      unlocked.includes(node.id)
    ) {
      return;
    }
    setResources(r => ({
      ...r,
      credit: r.credit - node.cost.credit,
      scrap: r.scrap - node.cost.scrap,
    }));
    setUnlocked(u => [...u, node.id]);
  };

  const tiers = [
    upgradeTree.filter(n => n.requires.length === 0),
    upgradeTree.filter(n => n.requires.length === 1),
    upgradeTree.filter(n => n.requires.length > 1),
  ];

  return (
    <div className="tree">
      {tiers.map((tier, i) => (
        <div key={i} className="tier">
          {tier.map(node => (
            <button
              key={node.id}
              disabled={
                !canUnlock(node.id, unlocked) ||
                resources.credit < node.cost.credit ||
                resources.scrap < node.cost.scrap ||
                unlocked.includes(node.id)
              }
              onClick={() => unlock(node)}
            >
              {node.name} (C:{node.cost.credit} S:{node.cost.scrap}) {unlocked.includes(node.id) ? '✓' : ''}
            </button>
          ))}
        </div>
      ))}
      <button onClick={onClose}>Return to Base</button>
    </div>
  );
}
