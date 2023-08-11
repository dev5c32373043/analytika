import { isPlainObject, isEmpty, safeParseJson, history } from './helpers';

class FetchWrapper {
  constructor() {
    this.reqInterceptors = [];
    this.resInterceptors = [];
  }

  get(path, opts) {
    return this.perform('GET', path, null, opts);
  }
  post(path, data, opts) {
    return this.perform('POST', path, data, opts);
  }
  put(path, data, opts) {
    return this.perform('PUT', path, data, opts);
  }
  patch(path, data, opts) {
    return this.perform('PATCH', path, data, opts);
  }
  delete(path, opts) {
    return this.perform('DELETE', path, null, opts);
  }

  async perform(method, path, data, extraOpts = {}) {
    const opts = { method, ...extraOpts };

    opts.headers ||= {};

    if (!isEmpty(data)) {
      opts.body = JSON.stringify(data);
      opts.headers['Content-Type'] = 'application/json';
    }

    for (const interceptor of this.reqInterceptors) {
      interceptor(opts);
    }

    const resp = await fetch(path, opts);

    for (const interceptor of this.resInterceptors) {
      interceptor(resp);
    }

    const json = await resp.json();
    return { status: resp.status, data: json };
  }
  reqInterceptor(fn) {
    this.reqInterceptors.push(fn);
  }
  resInterceptor(fn) {
    this.resInterceptors.push(fn);
  }
}

export const request = new FetchWrapper();

request.reqInterceptor(opts => {
  const customer = safeParseJson(localStorage.getItem('__customer'));

  if (isPlainObject(customer) && !isEmpty(customer)) {
    opts.headers['Authorization'] = `Bearer ${customer.accessToken}`;
  }
});

request.resInterceptor(resp => {
  if (resp.status !== 401) return;

  localStorage.removeItem('__customer');
  localStorage.removeItem('__api__');

  if (history.location.pathname !== '/login') {
    history.navigate('/login');
  }
});
