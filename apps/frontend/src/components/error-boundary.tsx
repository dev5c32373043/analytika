import { Component } from 'react';
import { history } from '../utils';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex flex-col w-full h-screen items-center bg-gray-800">
        <h2 className="my-8 text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-3xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Unfortunately, something is broken.
            <br />
            Sorry about that.
            <br />
            We're already working on it!
          </span>
        </h2>

        <button
          onClick={() => history.navigate(0)}
          className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
        >
          <span>
            Refresh & try your luck{' '}
            <span role="img" aria-label="wish you luck">
              🍀
            </span>
          </span>
        </button>
      </div>
    );
  }
}
