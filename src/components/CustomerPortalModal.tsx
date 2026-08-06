import React, { useState } from 'react';
import { supabase } from '../supabase';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  productName: string;
  quantity: number;
  flavor: string;
  price: number;
}

interface CustomerOrder {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customer, setCustomer] = useState<{ name: string; points: number } | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      alert('Digite um número de WhatsApp válido.');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // 1. Busca dados do cliente / pontos
      const { data: custData } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .single();

      if (custData) {
        setCustomer({ name: custData.name, points: custData.points || 0 });
      } else {
        setCustomer(null);
      }

      // 2. Busca histórico de pedidos
      const { data: ordData } = await supabase
        .from('customer_orders')
        .select('*')
        .eq('phone', cleanPhone)
        .order('created_at', { ascending: false });

      setOrders(ordData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden">
        
        {/* Efeito de luz decorativo */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              ⭐ Clube & Histórico
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Consulte seus pontos de fidelidade e pedidos pelo WhatsApp
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Seu Número do WhatsApp
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="(00) 90000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Consultar'}
              </button>
            </div>
          </div>
        </form>

        {searched && !loading && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {/* Cartão de Fidelidade / Pontos */}
            {customer ? (
              <div className="bg-gradient-to-br from-emerald-950/40 to-neutral-950 border border-emerald-500/30 rounded-2xl p-5 shadow-inner">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Cliente Verificado
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{customer.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">{customer.points}</p>
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase">Pontos Fidelidade</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 text-center text-neutral-400 text-sm">
                Nenhum cadastro de fidelidade encontrado para este número ainda. Faça seu primeiro pedido para começar a acumular pontos!
              </div>
            )}

            {/* Histórico de Pedidos */}
            <div>
              <h4 className="text-sm font-bold text-neutral-300 mb-3 uppercase tracking-wider">
                Meus Pedidos Anteriores ({orders.length})
              </h4>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-900 pb-2">
                        <span>📅 {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">{order.status}</span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-300">
                            <span>{item.quantity}x {item.productName} {item.flavor ? `(${item.flavor})` : ''}</span>
                            <span className="text-neutral-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900 font-bold text-sm text-white">
                        <span>Total do Pedido:</span>
                        <span className="text-emerald-400">R$ {Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 text-center py-2">Nenhum pedido registrado no histórico.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
