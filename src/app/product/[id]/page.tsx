// utils
import axios, { endpoints } from 'src/utils/axios';
// sections
import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Product: Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductShopDetailsPage({ params }: Props) {
  const { id } = params;

  return <ProductShopDetailsView id={id} />;
}

export async function generateStaticParams() {
  const res = await axios.get(endpoints.product.list);

  return res.data.products.map((product: { id: string }) => ({
    id: product.id,
  }));
}
