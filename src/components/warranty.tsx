import dayjs from 'dayjs';

export default function WarrantyComponent({
  index,
  warranty,
}: {
  index: number;
  warranty: {
    certifier: string;
    date: string;
    description: string;
    type: string;
  };
}) {
  return (
    <div className='grid gap-y-4'>
      <div className='grid'>
        <span className='font-medium text-accents-3'>
          Warranty #{index + 1}
        </span>
        <span className='text-2xl'>{warranty.type}</span>
      </div>
      <p>{warranty.description}</p>
      <div className='grid'>
        <span className='font-medium text-accents-3'>Certification Date</span>
        <span className='text-lg'>
          {dayjs(warranty.date).format('M/D/YYYY')}
        </span>
      </div>
      <div className='grid'>
        <span className='font-medium text-accents-3'>Certifier</span>
        <span className='text-lg'>{warranty.certifier}</span>
      </div>
    </div>
  );
}
