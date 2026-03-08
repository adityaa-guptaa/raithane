import React, { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Clock } from "lucide-react";


type CartItem = {
  id: string;
  name: string;
  variant?: string; // e.g., "500 ml"
  imageUrl: string;
  price: number; // current price (per unit)
  oldPrice?: number; // optional MRP / strikethrough
  qty: number;
};

type Fees = {
  delivery: number; // can be 0
  handling: number; // can be 0
};

function formatNPR(value: number) {
  // Simple NPR formatting (no Intl to keep it tiny)
  return `Rs.${value}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function CartOverlayDemo() {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Amul Taaza Toned Milk",
      variant: "500 ml",
      imageUrl:
        "https://images.unsplash.com/photo-1585238342028-4e28b5a6b8b3?auto=format&fit=crop&w=300&q=80",
      price: 29,
      qty: 1,
    },
    {
      id: "2",
      name: "Onion",
      variant: "1 kg",
      imageUrl:
        "https://images.unsplash.com/photo-1618517048289-4646902edaf5?auto=format&fit=crop&w=300&q=80",
      price: 37,
      oldPrice: 51,
      qty: 1,
    },
    {
      id: "3",
      name: "Amul Gold Full Cream Milk",
      variant: "1 l",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80",
      price: 69,
      qty: 1,
    },
  ]);

  const fees: Fees = useMemo(() => ({ delivery: 0, handling: 2 }), []);

  const totals = useMemo(() => {
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const mrpTotal = items.reduce(
      (sum, i) => sum + (i.oldPrice ?? i.price) * i.qty,
      0
    );
    const saved = clamp(mrpTotal - itemsTotal, 0, Number.MAX_SAFE_INTEGER);
    const grand = itemsTotal + fees.delivery + fees.handling;

    return { itemsTotal, mrpTotal, saved, grand };
  }, [items, fees.delivery, fees.handling]);

  const inc = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const dec = (id: string) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: clamp(i.qty - 1, 0, 999) } : i
        )
        .filter((i) => i.qty > 0)
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page content placeholder */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Demo Page Content
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Click the Cart button to open the overlay drawer.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <CartTrigger
              count={items.reduce((s, i) => s + i.qty, 0)}
              total={totals.grand}
              onClick={() => setOpen(true)}
            />
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setOpen(true)}
            >
              Open Cart
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        fees={fees}
        totals={totals}
        onInc={inc}
        onDec={dec}
        proceedLabel="Login to Proceed"
      />
    </div>
  );
}

/** A small trigger you can place in navbar/header */
function CartTrigger({
  count,
  total,
  onClick,
}: {
  count: number;
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-xl bg-emerald-700 px-4 py-3 text-white shadow-sm hover:bg-emerald-800 active:bg-emerald-900"
      aria-label="Open cart"
    >
      <span className="text-sm font-semibold">
        {formatNPR(total)}{" "}
        <span className="ml-1 text-xs font-medium opacity-90">TOTAL</span>
      </span>
      <span className="h-5 w-px bg-white/30" />
      <span className="text-sm font-semibold">
        Cart <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-xs">{count}</span>
      </span>
    </button>
  );
}

function CartDrawer({
  open,
  onClose,
  items,
  fees,
  totals,
  onInc,
  onDec,
  proceedLabel,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  fees: Fees;
  totals: { itemsTotal: number; mrpTotal: number; saved: number; grand: number };
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  proceedLabel: string;
}) {
  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="text-lg font-semibold text-gray-900">My Cart</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body scroll area */}
        <div className="h-[calc(100%-72px-92px)] overflow-y-auto px-5 py-4">
          {/* Delivery card */}
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Clock className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Delivery in 10 minutes
                </div>
                <div className="text-xs text-gray-600">
                  Shipment of {items.length} items
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    {item.variant ? (
                      <div className="text-xs text-gray-600">{item.variant}</div>
                    ) : null}
                    <div className="mt-1 flex items-baseline gap-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatNPR(item.price)}
                      </div>
                      {item.oldPrice ? (
                        <div className="text-xs text-gray-400 line-through">
                          {formatNPR(item.oldPrice)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <QtyControl
                    qty={item.qty}
                    onMinus={() => onDec(item.id)}
                    onPlus={() => onInc(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bill details */}
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">Bill details</div>

            <div className="mt-3 space-y-2 text-sm">
              <Row
                left={
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>Items total</span>
                    {totals.saved > 0 ? (
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        Saved {formatNPR(totals.saved)}
                      </span>
                    ) : null}
                  </div>
                }
                right={
                  <div className="flex items-baseline gap-2">
                    {totals.mrpTotal !== totals.itemsTotal ? (
                      <span className="text-xs text-gray-400 line-through">
                        {formatNPR(totals.mrpTotal)}
                      </span>
                    ) : null}
                    <span className="font-semibold text-gray-900">
                      {formatNPR(totals.itemsTotal)}
                    </span>
                  </div>
                }
              />

              <Row
                left={<span className="text-gray-700">Delivery charge</span>}
                right={
                  fees.delivery === 0 ? (
                    <span className="font-semibold text-blue-700">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {formatNPR(fees.delivery)}
                    </span>
                  )
                }
              />

              <Row
                left={<span className="text-gray-700">Handling charge</span>}
                right={
                  <span className="font-semibold text-gray-900">
                    {formatNPR(fees.handling)}
                  </span>
                }
              />

              <div className="my-2 h-px bg-gray-200" />

              <Row
                left={<span className="font-semibold text-gray-900">Grand total</span>}
                right={
                  <span className="text-lg font-bold text-gray-900">
                    {formatNPR(totals.grand)}
                  </span>
                }
              />
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">
              Cancellation Policy
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Orders cannot be cancelled once packed for delivery. In case of
              unexpected delays, a refund will be provided, if applicable.
            </p>
          </div>
        </div>

        {/* Bottom sticky bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl bg-emerald-700 px-4 py-4 text-white shadow-sm hover:bg-emerald-800 active:bg-emerald-900"
          >
            <div className="text-left">
              <div className="text-lg font-bold">{formatNPR(totals.grand)}</div>
              <div className="text-xs font-medium opacity-90">TOTAL</div>
            </div>
            <div className="text-sm font-semibold">{proceedLabel} ›</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyControl({
  qty,
  onMinus,
  onPlus,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg bg-emerald-700">
      <button
        type="button"
        onClick={onMinus}
        className="grid h-9 w-9 place-items-center text-white hover:bg-emerald-800"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="min-w-8 px-2 text-center text-sm font-semibold text-white">
        {qty}
      </div>
      <button
        type="button"
        onClick={onPlus}
        className="grid h-9 w-9 place-items-center text-white hover:bg-emerald-800"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm">{left}</div>
      <div className="text-sm">{right}</div>
    </div>
  );
}