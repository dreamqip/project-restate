import { MnemonicsProvider } from '@/providers/mnemonics-provider';

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='p-32'>
      <MnemonicsProvider>{children}</MnemonicsProvider>
    </main>
  );
}
