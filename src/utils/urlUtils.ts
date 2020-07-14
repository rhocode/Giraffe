export function removeUrlParam(key: string, sourceURL: string) {
  const queryString =
    sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
  let param,
    params_arr = [],
    rtn = sourceURL.split('?')[0];

  if (queryString !== '') {
    params_arr = queryString.split('&');
    for (let i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + '?' + params_arr.join('&');
  }
  return rtn;
}
