import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";

export default function Card2() {
	return (
		 <Card isFooterBlurred radius="lg" className="border-none rounded-3xl ">
			  <CardBody className="overflow-visible py-4 relative h-[180px] ">
					<Image alt="" className="object-fill rounded-xl" src="/image/c.png" fill />
			  </CardBody>

			  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
					<p className="text-tiny text-white/80">Available soon.</p>
					<Button
						 className="text-tiny text-white bg-black/20"
						 variant="flat"
						 color="default"
						 radius="lg"
						 size="sm">
						 Notify me
					</Button>
			  </CardFooter>
		 </Card>
	);
}