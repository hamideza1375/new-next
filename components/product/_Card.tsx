import { Card, CardHeader, CardBody } from "@nextui-org/react"
import Image  from "next/image";

export default function _Card() {
	return (
		 <Card className="py-4 lg:py-6 w-[240px] max-sm:w-[190px] max-[320px]:scale-95 max-[320px]:w-[170px] ">
			  <CardHeader className="pb-1 pt-0 px-4 flex-col items-start box-border ">
					<p className="text-tiny uppercase font-bold">Daily Mix</p>
					<small className="text-default-500">12 Tracks</small>
					<h4 className="font-bold text-large">Frontend Radio</h4>
			  </CardHeader>
			  <CardBody className="overflow-visible py-2 relative h-[250px] w-[220px] max-sm:w-[170px] max-[320px]:w-[150px] max-sm:h-[200px] mx-auto ">
					<Image alt="" draggable={false} className="object-fill rounded-xl" src="/image/c.png" fill />
			  </CardBody>
		 </Card>
	);
}