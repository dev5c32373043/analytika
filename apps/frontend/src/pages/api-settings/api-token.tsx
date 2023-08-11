import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchToken } from './api-token.slice';

import { isEmpty } from '../../utils';

export function ApiToken() {
  const dispatch = useDispatch();
  const apiToken = useSelector(state => state.apiToken);
  const inputRef = useRef(null);

  useEffect(() => {
    if (apiToken.loading !== 'idle' || !isEmpty(apiToken.value)) return;
    dispatch(fetchToken());
  }, [apiToken.value]);

  const copyToClipboard = () => {
    inputRef.current.select();
    document.execCommand('copy');
  };

  return (
    <div className="flex items-center relative">
      <input
        id="api-token"
        type="text"
        ref={inputRef}
        readOnly={true}
        value={apiToken.value}
        className="peer relative h-12 w-3/4 rounded border border-slate-200 px-4 text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
      <label
        htmlFor="api-token"
        className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        Your Api Token
      </label>
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center justify-center h-12 gap-2 px-4 text-sm font-medium tracking-wide transition duration-300 rounded shadow-md focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 shadow-emerald-100 hover:bg-emerald-100 hover:text-emerald-600 hover:shadow-md hover:shadow-emerald-100 focus:bg-emerald-200 focus:text-emerald-700 focus:shadow-md focus:shadow-emerald-100 disabled:cursor-not-allowed disabled:border-emerald-100 disabled:bg-emerald-100 disabled:shadow-none"
      >
        <span>Copy To Clipboard</span>
      </button>
    </div>
  );
}
