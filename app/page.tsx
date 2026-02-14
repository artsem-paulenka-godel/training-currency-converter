"use client";

import { Suspense, useState } from "react";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageFooter } from "@/components/PageFooter/PageFooter";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { ConverterForm } from "@/components/ConverterForm/ConverterForm";
import { ConversionHistory } from "@/components/ConversionHistory/ConversionHistory";
import { useExchangeRates } from "@/hooks/useExchangeRates/useExchangeRates";
import { useConverter } from "@/hooks/useConverter/useConverter";

export default function Home() {
  return (
    <Suspense
      fallback={
        <PageLayout>
          <LoadingSpinner message="Loading page..." />
        </PageLayout>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Fetch exchange rates
  const { exchangeRates, loading, error, refreshRates, isRefreshingRates } =
    useExchangeRates();

  // Conversion logic
  const {
    amount,
    fromCurrency,
    toCurrency,
    result,
    validationError,
    history,
    setAmount,
    setFromCurrency,
    setToCurrency,
    handleSwap,
    loadFromHistory,
    clearConversionHistory,
  } = useConverter(exchangeRates);

  return (
    <PageLayout>
      <PageHeader
        title="Currency Converter"
        subtitle="Convert currencies with real-time exchange rates"
      />

      {/* Main Converter Card */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
        <ErrorMessage message={error} />

        {loading ? (
          <LoadingSpinner message="Loading exchange rates..." />
        ) : (
          <ConverterForm
            amount={amount}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            result={result}
            validationError={validationError}
            exchangeRates={exchangeRates}
            onAmountChange={setAmount}
            onFromCurrencyChange={setFromCurrency}
            onToCurrencyChange={setToCurrency}
            onSwap={handleSwap}
            onRefreshRates={refreshRates}
            isRefreshingRates={isRefreshingRates}
          />
        )}
      </div>

      {/* History Section */}
      <ConversionHistory
        history={history}
        showHistory={showHistory}
        onToggle={() => setShowHistory(!showHistory)}
        onClear={clearConversionHistory}
        onLoadConversion={(conversion) => {
          loadFromHistory(conversion);
          setShowHistory(false);
        }}
      />

      <PageFooter lastUpdated={exchangeRates?.timestamp} />
    </PageLayout>
  );
}
