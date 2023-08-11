import { useState, useEffect, InputEvent } from 'react';

import { debounce, dedupByKey } from '../utils';

interface Props {
  placeholder: string;
  label: string;
  minInputLength: number;
  onSelect: (item) => void;
  onSearch: (searchTxt: string) => Promise<any[]>;
}

interface CacheItems {
  createdAt: number;
  items: any[];
}

const CACHE_LIMIT = 15; // 15 last searches
const CACHE_TTL = 300_000; // 5 minutes

export function Autocomplete(props: Props) {
  const [itemsCache, setItemsCache] = useState({});
  const [state, setState] = useState({
    id: Math.random().toString(36).substring(2),
    searchTxt: '',
    isOpen: true,
    currentItem: null,
    items: [],
  });

  const { label, placeholder, minInputLength } = props;

  function onSelect(item) {
    props.onSelect(item);
    setState(prev => ({ ...prev, searchTxt: item[label], isOpen: false, currentItem: item }));
  }

  function onInput(ev: InputEvent<HTMLInputElement>) {
    const searchTxt = ev.target.value;
    setState(prev => ({ ...prev, searchTxt }));
  }

  function getFromCache(searchTxt: string): any[] | null {
    const result = itemsCache[searchTxt];
    if (!result) return null;

    const { createdAt, items } = result as CacheItems;
    if (Date.now() - createdAt > CACHE_TTL) {
      const clonedCache = structuredClone(itemsCache);
      delete clonedCache[searchTxt];
      setItemsCache(clonedCache);
      return null;
    }

    return items;
  }

  function setCache(searchTxt: string, items: any[]) {
    const clonedCache = structuredClone(itemsCache);
    const keys = Object.keys(clonedCache);

    if (keys.length >= CACHE_LIMIT) {
      const oldestKey = keys.reduce((oldestKey, key) =>
        clonedCache[key].createdAt < clonedCache[oldestKey].createdAt ? key : oldestKey,
      );

      delete clonedCache[oldestKey];
    }

    clonedCache[searchTxt] = { createdAt: Date.now(), items };

    setItemsCache(clonedCache);
  }

  const clearSelected = () => {
    props.onSelect();
    setState(prev => ({ ...prev, searchTxt: '', currentItem: null, items: [], isOpen: false }));
  };

  const searchItems = debounce(async (searchTxt: string) => {
    const items = getFromCache(searchTxt) || dedupByKey(await props.onSearch(searchTxt), label);
    setCache(searchTxt, items);

    setState(prev => ({ ...prev, items, isOpen: true }));
  }, 400);

  useEffect(() => {
    if (state.searchTxt.trim().length < minInputLength) {
      if (state.isOpen) {
        setState(prev => ({ ...prev, items: [], isOpen: false }));
      }

      return;
    }

    if (state.currentItem && state.currentItem[label] === state.searchTxt) return;

    searchItems(state.searchTxt);
  }, [state.searchTxt]);

  return (
    <div className="relative autocomplete">
      <input
        type="text"
        id={state.id}
        name={`${state.id}-autocomplete`}
        value={state.searchTxt}
        onInput={onInput}
        placeholder={placeholder}
        className="relative w-full h-12 px-4 pl-12 placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />

      <label
        htmlFor={state.id}
        className="cursor-text select-none peer-focus:cursor-default absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-10 peer-placeholder-shown:text-base peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
      >
        {placeholder}
      </label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-6 h-6 top-3 left-4 stroke-slate-400 peer-disabled:cursor-not-allowed"
        fill="none"
        aria-hidden="true"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        role="graphics-symbol"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <circle cx="15" cy="15" r="4" />
        <path d="M18.5 18.5l2.5 2.5" /> <path d="M4 6h16" /> <path d="M4 12h4" /> <path d="M4 18h4" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute ${
          state.currentItem?.id ? 'visible' : 'invisible'
        } w-6 h-6 top-3 right-4 stroke-red-400 cursor-pointer`}
        fill="none"
        aria-hidden="true"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-labelledby="title-clear-filter"
        role="graphics-symbol"
        onClick={clearSelected}
      >
        <title id="title-clear-filter">Clear filter</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>

      <ul
        className={`${
          state.isOpen ? 'flex' : 'hidden'
        } absolute top-full z-50 mt-1 flex w-full list-none flex-col rounded bg-white py-2 shadow-md shadow-slate-500/10 `}
      >
        {state.items.map(item => (
          <li key={item.id} onClick={ev => onSelect(item)}>
            <div
              className={` ${
                item.id === state.currentItem?.id ? 'bg-emerald-50 text-emerald-500' : 'bg-none text-slate-500'
              } flex items-start justify-start gap-2 p-2 px-5 cursor-pointer transition-colors duration-300 hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600 focus:outline-none focus-visible:outline-none`}
              href="#"
              aria-current={item.id === state.currentItem?.id ? 'page' : 'false'}
            >
              <span className="flex flex-col gap-1 overflow-hidden whitespace-nowrap">
                <span className="truncate leading-5">{item.action}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
