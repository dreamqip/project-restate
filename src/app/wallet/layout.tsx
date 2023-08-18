export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='px-4 pb-4 sm:px-32 sm:pb-32'>{children}</main>;
}
