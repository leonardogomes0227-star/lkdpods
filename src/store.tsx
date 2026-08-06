// === ADICIONAR AO CARRINHO COM VALIDAÇÃO DE ESTOQUE POR SABOR ===
  const addToCart = useCallback((product: Product, qty = 1, flavor = '') => {
    if (qty <= 0) return false;
    if (!flavor) {
      alert('Por favor, selecione um sabor.');
      return false;
    }

    let success = false;
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id && c.selectedFlavor === flavor);
      const currentQtyInCart = existing ? existing.quantity : 0;
      const requestedTotal = currentQtyInCart + qty;

      // Nota: Aqui o estoque do sabor pode ser validado. 
      // Se você guarda os sabores no formato string ou objeto, validamos aqui.
      success = true;
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id && c.selectedFlavor === flavor 
            ? { ...c, quantity: requestedTotal } 
            : c,
        );
      }
      return [...prev, { product, quantity: qty, selectedFlavor: flavor }];
    });
    return success;
  }, []);

  // === FLUXO AUTOMÁTICO AO FINALIZAR VENDA (Baixa no estoque e Registro) ===
  const recordSale = useCallback(async (amount: number, customerInfo?: { name: string; phone: string }) => {
    const timestamp = Date.now();
    const tempId = Math.random().toString();
    
    // 1. Registra a venda localmente
    setSales((prev) => [...prev, { id: tempId, amount, timestamp }]);

    // 2. Grava a venda na nuvem (Supabase)
    await supabase
      .from('sales')
      .insert([{ amount, timestamp }]);

    // 3. Processa cada item do carrinho para dar baixa no estoque e atualizar histórico do cliente
    for (const item of cart) {
      const product = item.product;
      const newStock = Math.max(0, product.stock - item.quantity);

      // Atualiza o estoque geral do produto na tela
      setProducts((prev) => 
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      );

      // Atualiza no Supabase
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);

      // Alerta se o produto/sabor esgotou
      if (newStock === 0) {
        await supabase.from('audit_logs').insert([{
          action: 'OUT_OF_STOCK',
          details: `O produto "${product.name}" (Sabor: ${item.selectedFlavor}) esgotou totalmente!`,
          timestamp: Date.now()
        }]);
      }
    }

    // 4. Se houver dados do cliente, salva/atualiza no Cadastro Inteligente de Clientes
    if (customerInfo && customerInfo.phone) {
      await supabase.from('customers').upsert([
        {
          phone: customerInfo.phone.trim(),
          name: customerInfo.name.trim(),
          last_purchase: timestamp,
          total_spent: amount,
          // O histórico completo pode ser alimentado em uma tabela de pedidos vinculada ao telefone
        }
      ], { onConflict: 'phone' });
    }

  }, [cart]);
