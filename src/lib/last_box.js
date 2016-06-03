
export default function(order_article) {
  const {quantity, tolerance, units_to_order} = order_article;
  const {unit_quantity} = order_article.article;

  const result = units_to_order * unit_quantity;

  const rQuantity  = Math.max(0, quantity - result);
  const rTolerance = tolerance - Math.max(0, result - quantity);
  const rMissing   = Math.max(0, unit_quantity - rQuantity - rTolerance);

  return {
    quantity:  rQuantity,
    tolerance: rTolerance,
    missing:   rMissing,
  };
}
