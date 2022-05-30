let lastBounds: Record<string, Record<string, any>> = {};

export function hasMapMovedSignificantly(map, idx = 1) {
  if (!lastBounds[idx]) lastBounds[idx] = {};

  let [[lg1, lt1], [lg2, lt2]] = map.getBounds().toArray();
  let lastLt = lastBounds[idx].lt1 || 0;
  let lastLg = lastBounds[idx].lg1 || 0;

  lastBounds[idx] = { lt1, lt2, lg1, lg2 };

  if (!(Math.abs(lastLt - lt1) > 0.004 || Math.abs(lastLg - lg1) > 0.004)) {
    return false;
  }

  return true;
}
