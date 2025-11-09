import React from "react";
import { FaWallet } from "react-icons/fa";

/**
 * WalletCard
 * Props:
 *  - balance (number)
 *  - escrowHeld (number)
 *  - currency (string) e.g. "USD" or "Br"
 *  - cardNumber (string) optional (will be masked)
 *  - cardHolder (string) optional
 */
export default function WalletCard({
  balance = 0,
  escrowHeld = 0,
  currency = "$",
  cardNumber = "4242424242424242",
  cardHolder = "Seller Wallet",
}) {
  const maskCard = (num) => {
    const s = String(num).replace(/\s+/g, "");
    if (s.length <= 4) return s;
    return "•••• •••• •••• " + s.slice(-4);
  };

  const format = (n) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden shadow-xl w-full h-full">
        {/* Card surface */}
        <div className="p-6 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white w-full h-full flex flex-col justify-between">
          {/* subtle decorative circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-[2px] pointer-events-none"></div>

          {/* Top row: chip and issuer */}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* chip */}
              <div className="w-10 h-8 bg-yellow-200 rounded-sm flex items-center justify-center shadow-inner">
                <div className="w-6 h-4 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-sm"></div>
              </div>
              <div className="text-xs opacity-90">Wallet</div>
            </div>

            {/* issuer / icon */}
            <div className="flex items-center gap-2">
              <div className="text-xs opacity-90">Available</div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <FaWallet className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="relative z-10 mt-6">
            <div className="text-xs uppercase tracking-wider opacity-90">
              Balance
            </div>
            <div className="mt-1 text-2xl md:text-3xl font-extrabold">
              <span className="text-sm align-super mr-1">{currency}</span>
              {format(balance)}
            </div>
          </div>

          {/* Escrow */}
          <div className="relative z-10 mt-4">
            <div className="text-xs uppercase tracking-wider opacity-80">
              In Escrow
            </div>
            <div className="mt-1 text-sm font-semibold">
              <span className="text-sm align-super mr-1">{currency}</span>
              {format(escrowHeld)}
            </div>
          </div>

          {/* bottom row: card number & holder */}
          <div className="relative z-10 mt-6 flex items-center justify-between">
            <div>
              <div className="text-sm tracking-widest">
                {maskCard(cardNumber)}
              </div>
              <div className="text-xs opacity-90 mt-1">{cardHolder}</div>
            </div>

            {/* fake mastercard-like circles */}
            <div className="flex items-center gap-[-6px]">
              <div className="w-6 h-6 rounded-full bg-yellow-400 border border-white/20"></div>
              <div className="w-6 h-6 rounded-full bg-red-500 ml-[-8px] border border-white/20"></div>
            </div>
          </div>
        </div>

        {/* subtle footer with action hint */}
        <div className="bg-white/5 p-3 text-xs text-white/80 flex justify-between items-center">
          <div>Seller Wallet</div>
          <div className="opacity-90">Updated now</div>
        </div>
      </div>
    </div>
  );
}
