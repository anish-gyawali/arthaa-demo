import { useState } from 'react';

const PRODUCTS = [
  { id: 'prod_1', name: 'Basic Plan',    price: 50,  description: '5 projects, 10GB storage'  },
  { id: 'prod_2', name: 'Pro Plan',      price: 150, description: '20 projects, 50GB storage' },
  { id: 'prod_3', name: 'Business Plan', price: 300, description: 'Unlimited, 200GB storage'  },
];

export default function Store() {
  const [loading,  setLoading]  = useState<string | null>(null);
  const [error,    setError]    = useState('');
  const [provider, setProvider] = useState<'esewa' | 'khalti'>('esewa');

  async function handleCheckout(product: typeof PRODUCTS[0]) {
    setLoading(product.id);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId:   product.id,
          productName: product.name,
          amount:      product.price,
          provider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Checkout failed');
        setLoading(null);
        return;
      }

      window.location.assign(data.checkout_url);

    } catch {
      setError('Could not connect to server. Make sure the demo server is running on port 4000.');
      setLoading(null);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F6F6F9',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #EEEEF3',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #635BFF, #DC143C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: 'white',
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#0F0F1A' }}>
            NepalStore
          </span>
        </div>
        <div style={{
          background: '#F0EFFF', color: '#635BFF',
          fontSize: 11, fontWeight: 600,
          padding: '3px 10px', borderRadius: 20,
          border: '1px solid #C7D2FE',
        }}>
          Powered by Arthaa
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: '#0F0F1A',
            letterSpacing: '-0.02em', margin: '0 0 8px',
          }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: 15, color: '#8888A0', margin: 0 }}>
            Pay securely with eSewa or Khalti
          </p>
        </div>

        {/* Provider selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          {(['esewa', 'khalti'] as const).map(p => (
            <button key={p} onClick={() => setProvider(p)} style={{
              padding: '8px 20px', borderRadius: 8,
              border: provider === p ? '2px solid #635BFF' : '2px solid #EEEEF3',
              background: provider === p ? '#F0EFFF' : 'white',
              color: provider === p ? '#635BFF' : '#8888A0',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: 4,
                background: p === 'esewa' ? '#16A34A' : '#7C3AED',
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10, color: 'white', fontWeight: 700,
              }}>
                {p === 'esewa' ? 'e' : 'K'}
              </span>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '10px 16px',
            fontSize: 13, color: '#E02424',
            marginBottom: 20, textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Products */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {PRODUCTS.map((product, i) => (
            <div key={product.id} style={{
              background: 'white',
              border: i === 1 ? '2px solid #635BFF' : '1px solid #EEEEF3',
              borderRadius: 12, padding: 24,
              position: 'relative',
              boxShadow: i === 1
                ? '0 4px 20px rgba(99,91,255,0.15)'
                : '0 1px 3px rgba(15,15,26,0.04)',
            }}>
              {i === 1 && (
                <div style={{
                  position: 'absolute', top: -12,
                  left: '50%', transform: 'translateX(-50%)',
                  background: '#635BFF', color: 'white',
                  fontSize: 11, fontWeight: 700,
                  padding: '3px 12px', borderRadius: 20,
                  whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F0F1A', marginBottom: 6 }}>
                {product.name}
              </div>
              <div style={{ fontSize: 13, color: '#8888A0', marginBottom: 20 }}>
                {product.description}
              </div>
              <div style={{
                fontSize: 30, fontWeight: 800, color: '#0F0F1A',
                letterSpacing: '-0.03em', marginBottom: 4,
              }}>
                NPR {product.price.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#B8B8C8', marginBottom: 20 }}>
                per month
              </div>

              <button
                onClick={() => handleCheckout(product)}
                disabled={!!loading}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  border: i === 1 ? 'none' : '1px solid #635BFF',
                  background: i === 1 ? '#635BFF' : 'white',
                  color: i === 1 ? 'white' : '#635BFF',
                  fontWeight: 600, fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading === product.id ? 0.7 : 1,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                }}
              >
                {loading === product.id ? (
                  <>
                    <div style={{
                      width: 14, height: 14,
                      border: '2px solid',
                      borderColor: i === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(99,91,255,0.3)',
                      borderTopColor: i === 1 ? 'white' : '#635BFF',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Redirecting...
                  </>
                ) : (
                  `Pay with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{
          marginTop: 48, background: 'white',
          border: '1px solid #EEEEF3', borderRadius: 12, padding: 24,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#635BFF',
            marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            How payments work
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}>
            {[
              { step: '1', text: 'Click Pay — redirected to Arthaa checkout' },
              { step: '2', text: 'Complete payment on eSewa or Khalti'       },
              { step: '3', text: 'Arthaa verifies and sends webhook event'   },
              { step: '4', text: 'Order confirmed instantly'                 },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: '#F0EFFF', color: '#635BFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: 13, color: '#666680', lineHeight: 1.5 }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#B8B8C8' }}>
          Payments processed by{' '}
          <a href="https://arthaa.dev" target="_blank" rel="noreferrer"
            style={{ color: '#635BFF', textDecoration: 'none', fontWeight: 600 }}>
            Arthaa
          </a>
          {' '}— payment infrastructure for Nepal
        </div>
      </main>
    </div>
  );
}
