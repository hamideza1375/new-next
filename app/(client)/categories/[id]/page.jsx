'use client';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { Button, Card, CardBody, CardFooter, Divider, Input } from '@nextui-org/react';
import Image from 'next/image';
import _Footer from '@/components/product/_Footer';

function Filter() {
    return (
        <div className="w-full h-14 flex justify-between border-b ">
            <div className="flex gap-2 items-center h-full ml-2 ">
                <ArrowUpIcon className="w-7 h-7 cursor-pointer" />
                <ArrowDownIcon className="w-7 h-7 cursor-pointer" />
            </div>

            <div className="flex gap-2 items-center h-full ml-2 mr-1 ">
                <Button className="scale-90">تایید</Button>
                <Input type="number" endContent={':تا'} />
                <Input type="number" endContent={':از'} />
            </div>
        </div>
    );
}

export default function ProductList() {
    return (
        <div className="w-full h-full flex flex-col flex-1 ">
            <div className="flex gap-4 flex-wrap">
                <Filter />

                <_Card />

                <Divider />
            </div>
            
                <_Footer />
        </div>
    );
}

function _Card() {
    const list = [
        {
            title: 'Orange',
            img: '/images/fruit-1.jpeg',
            price: '$5.50'
        },
        {
            title: 'Tangerine',
            img: '/images/fruit-2.jpeg',
            price: '$3.00'
        },
        {
            title: 'Raspberry',
            img: '/images/fruit-3.jpeg',
            price: '$10.00'
        },
        {
            title: 'Lemon',
            img: '/images/fruit-4.jpeg',
            price: '$5.30'
        },
        {
            title: 'Avocado',
            img: '/images/fruit-5.jpeg',
            price: '$15.70'
        },
        {
            title: 'Lemon 2',
            img: '/images/fruit-6.jpeg',
            price: '$8.00'
        },
        {
            title: 'Banana',
            img: '/images/fruit-7.jpeg',
            price: '$7.50'
        },
        {
            title: 'Watermelon',
            img: '/images/fruit-8.jpeg',
            price: '$12.20'
        }
    ];

    return (
        <>
            {list.map((item, index) => (
                <Card
                    className="w-60 max-w-72 mx-auto h-60 flex-grow border max-[510px]:w-52 p-1"
                    shadow="sm"
                    key={index}
                    isPressable
                    onPress={() => console.log('item pressed')}>
                    <CardBody className="overflow-visible p-0 relative">
                        <Image
                            shadow="sm"
                            radius="lg"
                            fill
                            alt={item.title}
                            className="w-full object-cover h-[140px]"
                            src={item.img}
                        />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                        <b>{item.title}</b>
                        <p className="text-default-500">{item.price}</p>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
