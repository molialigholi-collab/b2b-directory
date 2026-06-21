"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Product } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { createMyProduct, deleteMyProduct, getMyProducts, updateMyProduct } from "@/lib/dashboard";

type ProductFormState = {
  description: string;
  name: string;
};

const emptyProductForm: ProductFormState = {
  description: "",
  name: "",
};

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [newProduct, setNewProduct] = useState<ProductFormState>(emptyProductForm);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const user = await getCurrentUser();
    setIsLoggedIn(Boolean(user));

    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getMyProducts();
      setProducts(response.products);
      setCompanyName(response.company?.name || "");
      setDetail(response.detail || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const product = await createMyProduct(newProduct);
      setProducts((current) => [product, ...current]);
      setNewProduct(emptyProductForm);
      setSuccess("Product added.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to add product.");
    }
  }

  async function handleUpdate(productId: number, payload: ProductFormState) {
    setError("");
    setSuccess("");

    try {
      const updated = await updateMyProduct(productId, payload);
      setProducts((current) => current.map((product) => (product.id === productId ? updated : product)));
      setSuccess("Product updated.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update product.");
    }
  }

  async function handleDelete(productId: number) {
    setError("");
    setSuccess("");

    try {
      await deleteMyProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      setSuccess("Product deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    }
  }

  if (isLoading) {
    return <div className="border border-line bg-white p-6 text-sm text-ink/65 shadow-panel">Loading product dashboard...</div>;
  }

  if (!isLoggedIn) {
    return <LoginRequired />;
  }

  if (!companyName && detail) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-bold tracking-normal text-ink">Products</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">{detail}</p>
        <Link href="/dashboard" className="mt-5 inline-flex text-sm font-semibold text-teal transition hover:text-ink">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/dashboard" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
        Back to dashboard
      </Link>
      <section className="border-b border-line pb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-saffron">Product workspace</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Products</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Managing products for {companyName}.</p>
      </section>

      <section className="border border-line bg-white p-5 shadow-panel">
        <h2 className="text-xl font-semibold text-ink">Add Product</h2>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4">
          <ProductFields value={newProduct} onChange={setNewProduct} />
          <button type="submit" className="min-h-11 border border-saffron bg-saffron px-5 text-sm font-semibold text-white transition hover:bg-ink">
            Add Product
          </button>
        </form>
      </section>

      {success ? <p className="text-sm font-medium text-teal">{success}</p> : null}
      {error ? <p className="text-sm font-medium text-berry">{error}</p> : null}

      <section className="grid gap-4">
        {products.length ? (
          products.map((product) => (
            <EditableProduct key={product.id} product={product} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))
        ) : (
          <div className="border border-dashed border-line bg-white p-5 text-sm text-ink/65 shadow-panel">No products yet.</div>
        )}
      </section>
    </div>
  );
}

function ProductFields({ onChange, value }: { onChange: (value: ProductFormState) => void; value: ProductFormState }) {
  return (
    <>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Product name
        <input
          required
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          className="min-h-11 border border-line bg-paper px-3 font-normal outline-none focus:border-saffron"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Description
        <textarea
          rows={5}
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          className="border border-line bg-paper px-3 py-3 font-normal outline-none focus:border-saffron"
        />
      </label>
    </>
  );
}

function EditableProduct({ onDelete, onUpdate, product }: { onDelete: (id: number) => void; onUpdate: (id: number, payload: ProductFormState) => void; product: Product }) {
  const [value, setValue] = useState<ProductFormState>({
    description: product.description || "",
    name: product.name,
  });

  return (
    <article className="border border-line bg-white p-5 shadow-panel">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(product.id, value);
        }}
        className="grid gap-4"
      >
        <ProductFields value={value} onChange={setValue} />
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="min-h-11 border border-saffron bg-saffron px-5 text-sm font-semibold text-white transition hover:bg-ink">
            Save
          </button>
          <button type="button" onClick={() => onDelete(product.id)} className="min-h-11 border border-line px-5 text-sm font-semibold text-ink transition hover:border-berry hover:text-berry">
            Delete
          </button>
          <Link href={`/products/${product.id}`} className="inline-flex min-h-11 items-center border border-line px-5 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal">
            View public page
          </Link>
        </div>
      </form>
    </article>
  );
}

function LoginRequired() {
  return (
    <div className="mx-auto max-w-xl border border-line bg-white p-6 shadow-panel">
      <h1 className="text-3xl font-bold tracking-normal text-ink">Login Required</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">Login to manage company products.</p>
      <Link href="/login" className="mt-5 inline-flex border border-teal bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink">
        Login
      </Link>
    </div>
  );
}
