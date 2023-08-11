export function Loader() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby="title-loader"
      className="h-6 w-6"
    >
      <title id="title-loader">Loading content...</title>
      <path d="M7 8H3V16H7V8Z" className="animate animate-bounce fill-emerald-500 " />
      <path d="M14 8H10V16H14V8Z" className="animate animate-bounce fill-emerald-500 [animation-delay:.2s]" />
      <path d="M21 8H17V16H21V8Z" className="animate animate-bounce fill-emerald-500 [animation-delay:.4s]" />
    </svg>
  );
}
