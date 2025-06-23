interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Açıklama</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
} 