// ADICIONE esta interface nova, logo ACIMA da interface Product:
export interface FlavorStock {
  name: string;
  stock: number;
}

// Dentro da interface Product, REMOVA a linha:
//   flavor: string;
// e ADICIONE no lugar dela:
//   flavors: FlavorStock[];
//
// O campo "stock: number;" pode continuar existindo no Product — ele passa a
// representar o estoque TOTAL (soma de todos os sabores), calculado
// automaticamente pelo app. Não precisa mexer nele.
