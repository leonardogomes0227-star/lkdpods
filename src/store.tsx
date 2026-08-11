recordSale: async (amount, customerInfo) => {
    const timestamp = Date.now();
    const state = get();
    const cartItems = Array.isArray(state.cart) ? state.cart : [];
    const totalCost = cartItems.reduce((sum, item) => sum + item.product.cost * item.quantity, 0);
    const profit = amount - totalCost;
    const tempSaleId = Math.random().toString();

    set((prev) => {
      const newSales = [...(prev.sales || []), { id: tempSaleId, amount, timestamp }];
      return { sales: newSales, ...computeTotals(newSales) };
    });

    try {
      await supabase.from('sales').insert([{ amount, timestamp }]);
    } catch (e) {
      console.error('Erro ao salvar venda:', e);
    }

    let orderId: string | null = null;
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('customer_orders')
        .insert([{
          phone: customerInfo?.phone?.trim() || null,
          customer_name: customerInfo?.name?.trim() || null,
          total: amount,
          status: 'pendente',
        }])
        .select()
        .single();
      if (!orderError && orderData) orderId = orderData.id;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
    }

    for (const item of cartItems) {
      const product = item.product;
      const updatedFlavors = decrementFlavorStock(product.flavors, item.selectedFlavor, item.quantity);
      const newTotalStock = updatedFlavors.reduce((sum, f) => sum + f.stock, 0);

      set((prev) => ({
        products: (Array.isArray(prev.products) ? prev.products : []).map((p) =>
          p.id === product.id ? { ...p, flavors: updatedFlavors, stock: newTotalStock } : p
        ),
      }));

      try {
        await supabase
          .from('products')
          .update({ flavors: updatedFlavors, stock: newTotalStock })
          .eq('id', product.id);
      } catch (e) {
        console.error('Erro ao atualizar estoque no banco:', e);
      }
    }

    if (customerInfo && customerInfo.phone) {
      const phone = customerInfo.phone.trim();
      const name = customerInfo.name.trim();
      
      try {
        const { data: existing } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', phone)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('customers')
            .update({
              name,
              last_purchase: timestamp,
              purchase_count: (existing.purchase_count || 0) + 1,
              total_spent: (existing.total_spent || 0) + amount,
            })
            .eq('phone', phone);
        } else {
          await supabase.from('customers').insert([{
            phone,
            name,
            first_purchase: timestamp,
            last_purchase: timestamp,
            purchase_count: 1,
            total_spent: amount,
          }]);
        }
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
      }

      set((prev) => {
        const customers = Array.isArray(prev.customers) ? prev.customers : [];
        const idx = customers.findIndex((c) => c.phone === phone);
        if (idx >= 0) {
          const updated = [...customers];
          updated[idx] = {
            ...updated[idx],
            name,
            lastPurchase: timestamp,
            purchaseCount: updated[idx].purchaseCount + 1,
            totalSpent: updated[idx].totalSpent + amount,
          };
          return { customers: updated };
        }
        return {
          customers: [
            { id: phone, phone, name, firstPurchase: timestamp, lastPurchase: timestamp, purchaseCount: 1, totalSpent: amount },
            ...customers,
          ],
        };
      });
    }

    if (orderId) {
      set((prev) => ({
        orders: [
          {
            id: orderId!,
            customerPhone: customerInfo?.phone,
            customerName: customerInfo?.name,
            timestamp,
            totalAmount: amount,
            totalCost,
            profit,
            items: cartItems.map((item) => ({
              id: Math.random().toString(),
              productId: item.product.id,
              productName: item.product.name,
              brand: item.product.brand,
              flavor: item.selectedFlavor,
              quantity: item.quantity,
              unitPrice: item.product.price,
              unitCost: item.product.cost,
            })),
          },
          ...(Array.isArray(prev.orders) ? prev.orders : []),
        ],
      }));
    }
  },
