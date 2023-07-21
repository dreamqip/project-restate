type TransactionProps = {
  date: string;
};

export default function Transaction({ date }: TransactionProps) {
  return (
    <div className='grid gap-y-4 border-b border-dashed py-6'>
      <div className='grid'>
        <span className='font-medium text-accents-3'>Time (UTC+1)</span>
        <span>{date}</span>
      </div>
      <div className='flex justify-between'>
        <div className='grid'>
          <span className='font-medium text-accents-3'>Transaction Type</span>
          <span>NFTokenAcceptOffer</span>
        </div>
        <div className='grid text-right'>
          <span className='font-medium text-accents-3'>Transaction Cost</span>
          <span>0.000012 XRP</span>
        </div>
      </div>
    </div>
  );
}
