'use client'
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";

export default function PrePurchases() {
	return (
	  <div className="flex flex-wrap gap-4 pt-5 px-3 " >
		<_Card/>
	  </div>
	)
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
