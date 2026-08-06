// Adicione essas funções/tipos na interface StoreContextValue e na StoreProvider:

export interface CustomerOrder {
  id: string;
  phone: string;
  items: { productName: string; quantity: number; flavor: string; price: number }[];
  total: number;
  status: string;
  created_at: string;
}

// 1. Função para buscar o histórico e pontos do cliente pelo WhatsApp
const lookupCustomer = async (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Busca dados de pontos
  const { data: customerData } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', cleanPhone)
    .single();

  // Busca histórico de pedidos do número
  const { data: ordersData } = await supabase
    .from('customer_orders')
    .select('*')
    .eq('phone', cleanPhone)
    .order('created_at', { ascending: false });

  return {
    customer: customerData || { name: '', points: 0 },
    orders: ordersData || []
  };
};

// 2. Na hora de finalizar o pedido no Checkout (quando o cliente conclui a compra):
const saveCustomerOrder = async (info: CheckoutInfo, cartItems: CartItem[], totalAmount: number) => {
  const cleanPhone = info.phone.replace(/\D/g, '');
  
  // Verifica se o cliente já existe, se não, cadastra com o nome e ganha pontos iniciais
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', cleanPhone)
    .single();

  const earnedPoints = Math.floor(totalAmount / 10); // Ex: 1 ponto a cada R$ 10 gastos

  if (!existing) {
    await supabase.from('customers').insert([
      { phone: cleanPhone, name: info.name, points: earnedPoints }
    ]);
  } else {
    await supabase
      .from('customers')
      .update({ points: (existing.points || 0) + earnedPoints })
      .eq('phone', cleanPhone);
  }

  // Salva o pedido no histórico do cliente
  const formattedItems = cartItems.map(item => ({
    productName: item.product.name,
    quantity: item.quantity,
    flavor: item.selectedFlavor,
    price: item.product.price
  }));

  await supabase.from('customer_orders').insert([
    {
      phone: cleanPhone,
      items: formattedItems,
      total: totalAmount,
      status: 'Recebido'
    }
  ]);

  // Registra também no fechamento geral da loja que você já tem
  recordSale(totalAmount);
};
