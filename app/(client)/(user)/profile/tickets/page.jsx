'use client'
import { Badge, Card, CardFooter, CardHeader, Divider } from '@nextui-org/react';

export default function Tickets() {
    return (
        <div className="flex flex-col gap-6 p-4 flex-1 items-center">
            {Array.from({ length: 9 }).map((item, index) => (
              <Card key={index} className="border w-[98%] h-40 rounded">
                    <CardHeader className='flex justify-between px-3 relative' >
                      <p>aa</p>
                  <Badge content='‌' className='absolute right-12 -top-1.5' color='success' >
                      <p className='text-zinc-400 text-sm ' >۰۴/۵/۲۲</p>
                </Badge>
                    </CardHeader>
                    <Divider/>
                    <CardFooter>dd</CardFooter>
                </Card>
            ))}
        </div>
    );
}
