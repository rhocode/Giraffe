function initializeMap<U, T>(map: Map<U, T>, key: U, defaultValue: T) {
  if (map.get(key) === undefined) {
    map.set(key, defaultValue);
  }
}

export default initializeMap;
