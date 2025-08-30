export const upgradeTree = [
  { id: 'root', name: 'Mining Basics', cost: { credit: 0, scrap: 0 }, requires: [] },
  { id: 'drill', name: 'Hardened Drill', cost: { credit: 5, scrap: 0 }, requires: ['root'] },
  { id: 'cart', name: 'Reinforced Cart', cost: { credit: 5, scrap: 0 }, requires: ['root'] },
  { id: 'thrusters', name: 'Ion Thrusters', cost: { credit: 10, scrap: 0 }, requires: ['drill', 'cart'] },
  { id: 'oxygen1', name: 'Spare Oxygen Tank', cost: { credit: 5, scrap: 0 }, requires: ['root'] },
  { id: 'laser1', name: 'Focused Laser', cost: { credit: 5, scrap: 0 }, requires: ['root'] },
  { id: 'blaster', name: 'Sidearm Blaster', cost: { credit: 8, scrap: 5 }, requires: ['laser1'] },
];

export function canUnlock(id, unlocked) {
  const node = upgradeTree.find(n => n.id === id);
  return node ? node.requires.every(r => unlocked.includes(r)) : false;
}
