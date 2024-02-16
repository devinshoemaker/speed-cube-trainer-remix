import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { prisma } from '~/db.server';
import { getUserId } from '~/session.server';

import Timer from '../../-components/timer';
import AlgorithmCard from '../algorithm-card';
import { Case, olls } from '../cases';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  const oll = olls.find((oll) => oll.name === params.name);
  if (oll) {
    if (userId) {
      const userOll = await prisma.ollStatus.findFirst({
        where: {
          userId: userId,
          ollName: params.name
        }
      });

      const mappedOll: Case = userOll
        ? {
            ...oll,
            id: userOll.id,
            name: userOll.ollName,
            status: userOll.status
          }
        : { ...oll, status: 'not-learned' };

      return json({ oll: mappedOll });
    }

    return json({ oll });
  }

  return redirect('/oll');
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) {
    const formData = await request.formData();
    const input = {
      ollName: params.name,
      status: formData.get('oll-status')
    };

    const parsedInput = z
      .object({
        ollName: z.string(),
        status: z.string()
      })
      .safeParse(input);

    if (parsedInput.success) {
      const { ollName, status } = parsedInput.data;
      const existingOll = await prisma.ollStatus.findFirst({
        where: {
          userId,
          ollName
        }
      });

      if (existingOll) {
        await prisma.ollStatus.update({
          where: {
            id: existingOll.id
          },
          data: {
            status
          }
        });

        return null;
      }

      await prisma.ollStatus.create({
        data: {
          ollName,
          status,
          user: {
            connect: {
              id: userId
            }
          }
        }
      });

      return null;
    }
  }

  return redirect('/');
}

export default function OllPage() {
  const { oll } = useLoaderData<typeof loader>();

  return (
    <div id="oll-page" className="h-full w-full flex flex-col items-center">
      <div className="max-w-sm pt-4">
        <AlgorithmCard algorithmCase={oll} />
      </div>
      <Timer />
    </div>
  );
}
