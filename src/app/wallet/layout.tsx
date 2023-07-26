export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='px-4 sm:px-32'>{children}</main>;
}
