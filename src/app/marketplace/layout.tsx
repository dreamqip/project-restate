export default function MarketPlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='p-4 sm:p-32'>{children}</main>;
}
