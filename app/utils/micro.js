export const toClassName = (obj) => Object
  .keys(obj)
  .reduce((list, name) => (obj[name] ? list.concat([name]) : list), [])
  .join(' ');