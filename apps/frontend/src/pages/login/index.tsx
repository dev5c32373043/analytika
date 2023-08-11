import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { login, resetError } from '../../app/customer.slice';

import { PasswordInput } from '../../components';

export type InputData = {
  email: string;
  passcode: string;
};

export function LoginPage() {
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = async data => {
    if (customer.loading !== 'idle') return;
    dispatch(login(data));
  };

  useEffect(() => {
    // Reset error state when form data is changed
    const sub = watch((value, { name, type }) => {
      if (customer.error) {
        dispatch(resetError());
      }
    });

    return () => sub.unsubscribe();
  }, [watch, dispatch, customer.error]);

  return (
    <div className="flex flex-col items-center h-100v bg-gray-800">
      <h2 className="my-8 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Login</span>
      </h2>

      <div className="max-w-md">
        <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-4">
            <span
              id="login-form-error"
              className={`relative ${
                customer.error ? 'visible' : 'invisible'
              } flex w-full justify-between px-4 py-1 text-md text-pink-500 transition`}
            >
              {customer.error}
            </span>
          </div>

          <div className="relative my-8">
            <input
              id="customer-email"
              type="email"
              name="customer-email"
              placeholder="Enter email"
              className="peer relative h-12 w-full rounded border border-slate-200 px-4 text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              {...register('email', { required: true })}
            />
            <label
              htmlFor="customer-email"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Email
            </label>
            <small
              id="customer-email-err"
              className={`absolute ${
                errors.email ? 'visible' : 'invisible'
              } flex w-full justify-between px-4 py-1 text-xs text-pink-500 transition`}
            >
              <span>Please provide correct email, e.g user@mail.com</span>
            </small>
          </div>
          <div className="relative mt-8 mb-10">
            <PasswordInput
              name="passcode"
              placeholder="Enter passcode"
              error={errors.passcode}
              errorMessage="Passcode should be at least 8 characters, at least one uppercase letter and one number"
              register={register}
              registerOptions={{ pattern: /^(?=.*[A-Z])(?=.*\d).{8,}$/, required: true }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-emerald-500 px-5 text-sm font-medium tracking-wide text-emerald-500 shadow-md shadow-emerald-200 transition duration-300 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:border-emerald-700 focus:text-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none"
            >
              <span>Submit</span>
            </button>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded border border-slate-500 tracking-wide shadow-md shadow-slate-400 text-slate-500 transition duration-300 hover:text-slate-600 focus-visible:outline-none"
            >
              Sign Up
            </Link>
          </div>
        </form>

        <p className="text-center text-gray-400 text-xs">
          &copy;{new Date().getFullYear()} Analytika Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
