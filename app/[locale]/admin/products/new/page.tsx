import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-500 mt-2">Add a new product or service to your catalog</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
