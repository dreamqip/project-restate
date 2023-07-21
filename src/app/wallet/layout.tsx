import Providers from './providers';

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='p-32'>
      <Providers>{children}</Providers>
    </main>
  );
}
