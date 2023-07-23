import type { Warranty } from '@/app/marketplace/test-product';

const warrantyMapping: { [key: number]: string } = {
  1: 'Artwork License',
  2: 'Asset Identity',
  3: 'Carbon Offset',
  4: 'NFT Pairing',
  5: 'Vault Report',
};

interface WarrantyProps {
  warranty: Warranty;
}

export default function WarrantyComponent({ warranty }: WarrantyProps) {
  return (
    <div className='grid gap-y-4'>
      <div className='grid'>
        <span className='font-medium text-accents-3'>
          Warranty #{warranty.type}
        </span>
        <span className='text-2xl'>{warrantyMapping[warranty.type]}</span>
      </div>
      <p>{warranty.description}</p>
      <div className='grid'>
        <span className='font-medium text-accents-3'>Certification Date</span>
        <span className='text-lg'>{warranty.date}</span>
      </div>
      <div className='grid'>
        <span className='font-medium text-accents-3'>Certifier</span>
        <span className='text-lg'>{warranty.certifier}</span>
      </div>
    </div>
  );
}
