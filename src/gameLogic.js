export function exchangeMineralsForCredit(resources) {
  if (resources.mineral >= 10) {
    return {
      ...resources,
      mineral: resources.mineral - 10,
      credit: resources.credit + 1,
    };
  }
  return resources;
}

export function exchangeScrapForCredit(resources) {
  if (resources.scrap >= 5) {
    return {
      ...resources,
      scrap: resources.scrap - 5,
      credit: resources.credit + 1,
    };
  }
  return resources;
}
