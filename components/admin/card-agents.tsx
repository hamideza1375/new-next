import { Avatar, AvatarGroup, Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export const CardAgents = ({userLength}:{userLength: number}) => {
    return (
    <Card className="bg-default-50 rounded-xl shadow-md px-4 py-6 w-full">
      <CardBody className="py-5 gap-6">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <Link href='/dashboard/users' className="text-default-900 text-xl font-semibold cursor-pointer ">
              {" "}
              {"⭐"}لیست کاربران
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-col">
          <AvatarGroup isBordered max={6} className="min-h-[40px]" >
          {Array.from({length:userLength}).map((_, index)=>(<Avatar key={index} src=""/>))}
          </AvatarGroup>
        </div>
      </CardBody>
    </Card>
    );
};
