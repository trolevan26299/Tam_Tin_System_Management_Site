// _mock
import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Order Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function OrderDetailsPage({ params }: Props) {
  const { id } = params;

  return <OrderDetailsView id={id} />;
}
