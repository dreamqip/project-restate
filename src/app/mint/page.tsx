'use client';

import type { CreateAssetPayload } from '@/types/notion';

import { Button, Checkbox, Input } from '@/components/ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useLedger } from '@/hooks/use-ledger';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { AlertCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  artworkLicense: z.string(),
  artworkLicenseCertifier: z.string(),
  artworkLicenseDate: z
    .string()
    .transform((val) => new Date(val).toISOString()),
  assetIdentity: z.string(),
  assetIdentityCertifier: z.string(),
  assetIdentityDate: z.string().transform((val) => new Date(val).toISOString()),
  carbonOffset: z.string(),
  carbonOffsetCertifier: z.string(),
  carbonOffsetDate: z.string().transform((val) => new Date(val).toISOString()),
  category: z.string().transform((val) => (!val ? 'Uncategorized' : val)),
  flags: z.object({
    tfBurnable: z.boolean(),
    tfOnlyXRP: z.boolean(),
    tfTransferable: z.boolean(),
    tfTrustLine: z.boolean(),
  }),
  images: z.string().nonempty(),
  nftPairing: z.string(),
  nftPairingCertifier: z.string(),
  nftPairingDate: z.string().transform((val) => new Date(val).toISOString()),
  nftTaxon: z.coerce.number(),
  subtitle: z.string(),
  title: z.string(),
  transferFee: z.coerce.number().max(50000).min(0),
  URI: z.string(),
  vaultReport: z.string(),
  vaultReportCertifier: z.string(),
  vaultReportDate: z.string().transform((val) => new Date(val).toISOString()),
});

export default function Page() {
  const { mintNFT } = useLedger();

  const today = dayjs().format('YYYY-MM-DD');

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      artworkLicense: '',
      artworkLicenseCertifier: '',
      artworkLicenseDate: today,
      assetIdentity: '',
      assetIdentityCertifier: '',
      assetIdentityDate: today,
      carbonOffset: '',
      carbonOffsetCertifier: '',
      carbonOffsetDate: today,
      category: '',
      flags: {
        tfBurnable: true,
        tfOnlyXRP: false,
        tfTransferable: true,
        tfTrustLine: true,
      },
      images: '',
      nftPairing: '',
      nftPairingCertifier: '',
      nftPairingDate: today,
      nftTaxon: 0,
      subtitle: '',
      title: '',
      transferFee: 0,
      URI: '',
      vaultReport: '',
      vaultReportCertifier: '',
      vaultReportDate: today,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const mintPromise = mintNFT({
      flags: {
        tfBurnable: true,
        tfOnlyXRP: false,
        tfTransferable: true,
        tfTrustLine: true,
      },
      NFTokenTaxon: values.nftTaxon,
      transferFee: values.transferFee,
      URI: values.URI,
    });

    const keysToRemove = ['nftTaxon', 'transferFee', 'URI', 'flags'];

    // Remove NFT values from payload
    const payload = Object.fromEntries(
      Object.entries(values).filter(([key]) => !keysToRemove.includes(key)),
    ) as CreateAssetPayload;

    const promise = mintPromise.then(async (data) => {
      const res = await fetch('/api/assets/create', {
        body: JSON.stringify({
          assetId: data.NFTokenID,
          ...payload,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error((await res.json()) as string);
      }

      return res.json();
    });

    toast.promise(promise, {
      error: (err) => err.message,
      loading: 'Minting asset...',
      success: 'Asset minted!',
    });
  }

  return (
    <main className='pb-4 pl-4 sm:pb-32 sm:pl-32'>
      <div className='max-w-sm'>
        <div className='mb-6'>
          <h1 className='mb-3 text-3xl font-bold'>Mint an asset</h1>
          <p>
            Missing available offers? No Worries! Mint a test asset and watch
            the offers list populate!
          </p>
        </div>
        <Form {...form}>
          <form
            className='flex w-full flex-col gap-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <p className='text-lg'>Flags</p>
              <div className='pl-2'>
                <FormField
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-x-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Burnable</FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name='flags.tfBurnable'
                />
                <FormField
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-x-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Only XRP</FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name='flags.tfOnlyXRP'
                />
                <FormField
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-x-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Trust Line</FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name='flags.tfTrustLine'
                />
                <FormField
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-x-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Transferable</FormLabel>
                    </FormItem>
                  )}
                  control={form.control}
                  name='flags.tfTransferable'
                />
              </div>
            </div>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Taxon</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This field specifies the category or classification for the
                    token, which is chosen by the creator. It&apos;s optional
                    and can be set to 0 if not needed.
                  </FormDescription>
                </FormItem>
              )}
              control={form.control}
              name='nftTaxon'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Fee</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Set a fee for reselling the token between 0% and 50%(50000),
                    only if Transferable option is enabled.
                  </FormDescription>
                </FormItem>
              )}
              control={form.control}
              name='transferFee'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URI</FormLabel>
                  <FormControl>
                    <Input placeholder='hex-encoded URI' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='URI'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Vacheron Constantin Patrimony'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='title'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='A Symbol of Pure Elegance, ...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='subtitle'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder='Watches' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='category'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Images *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate image URLs with a comma (,) and no spaces
                  </FormDescription>
                </FormItem>
              )}
              control={form.control}
              name='images'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Identity</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='The Vacheron Constantin Patrimony epitomizes timeless...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='assetIdentity'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Identity Date</FormLabel>
                  <FormControl>
                    <Input
                      max={dayjs().format('YYYY-MM-DD')}
                      type='date'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='assetIdentityDate'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Identity Certifier</FormLabel>
                  <FormControl>
                    <Input placeholder='Certify Corp.' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='assetIdentityCertifier'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Pairing</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='The Vacheron Constantin Patrimony has been securely...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='nftPairing'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Pairing Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='nftPairingDate'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Pairing Certifier</FormLabel>
                  <FormControl>
                    <Input placeholder='AuthentiTech Solutions' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='nftPairingCertifier'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbon Offset</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='The production of one Vacheron Constantin Patrimony watch...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='carbonOffset'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbon Offset Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='carbonOffsetDate'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbon Offset Certifier</FormLabel>
                  <FormControl>
                    <Input placeholder='GreenOffset Solutions' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='carbonOffsetCertifier'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artwork License</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='The digital artwork used has been...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='artworkLicense'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artwork License Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='artworkLicenseDate'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artwork License Certifier</FormLabel>
                  <FormControl>
                    <Input placeholder='ArtSecure' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='artworkLicenseCertifier'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault Report</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='The Vacheron Constantin Patrimony...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='vaultReport'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault Report Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='vaultReportDate'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault Report Certifier</FormLabel>
                  <FormControl>
                    <Input placeholder='TimepieceGuard' {...field} />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name='vaultReportCertifier'
            />
            <Alert className='mt-6' variant='warning'>
              <AlertCircleIcon />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Once you mint this NFT, you will not be able to edit it. Be sure
                to double check all the information you have entered.
              </AlertDescription>
            </Alert>
            <Button disabled={!form.formState.isValid} type='submit'>
              Mint
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
