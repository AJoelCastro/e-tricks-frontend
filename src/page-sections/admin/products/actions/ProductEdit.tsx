import React from 'react'
import ProductForm from './Product';
import { useParams, useRouter } from 'next/navigation';
import { IProduct } from '@/interfaces/Product';

const ProductEditPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const handleSuccess = (product: IProduct) => {
    // Mostrar mensaje de éxito o redirigir
    router.push('/admin/productos');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProductForm 
      productId={productId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

export default ProductEditPageSection
