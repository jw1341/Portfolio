export function setStateByPath(setFData, path, value) {
    const keys = path.split('.');
    setFData(prev => {
      const build = (obj, i = 0) => {
        const key = keys[i];
        if (i === keys.length - 1) return { ...obj, [key]: value };
        return { ...obj, [key]: build(obj?.[key] ?? {}, i + 1) };
      };
      return build(prev);
    });
  }
  
  export function getValueFromPath(obj, path) {
    const keys = path.includes('.') ? path.split('.') : [path];
    return keys.reduce((acc, key) => acc?.[key], obj);
  }
  
  export function removeValueAtPath(obj, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const parent = keys.reduce((acc, key) => acc?.[key], obj);
    if (parent && lastKey in parent) delete parent[lastKey];
  }
  
  export const createFormItem = (stateVar, stateSetter, path) => {
    let _path = path + (stateVar.length + 1);
    stateSetter([...stateVar, _path]);
  }
  
  export function syncState(obj, path) {
    return [...Object.keys(getValueFromPath(obj, path))];
  }