import { useSelector } from 'react-redux';

import { MainLayout } from '../../components';
import { ApiToken } from './api-token';

export function ApiSettingsPage() {
  const customer = useSelector(state => state.customer);

  return (
    <MainLayout>
      <div className="w-3/4">
        <p className="my-8 font-extrabold text-gray-800 md:text-xl lg:text-2xl text-center">
          Welcome {customer.record.name}!
          <br />
          Unfortunately, our client library is still in development.
          <br />
          For now, you can use our API directly 🙂
        </p>
        <ApiToken />

        <div className="flex justify-center mt-8">
          <iframe src="https://app.theneo.io/dev5c32373043/analytika" className="w-full h-screen" title="API docs" />
        </div>
      </div>
    </MainLayout>
  );
}
