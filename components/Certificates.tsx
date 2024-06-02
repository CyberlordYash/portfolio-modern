import Image from "next/image";
import React from "react";
import { Tabs } from "./ui/Tab";
import Certificate1 from "../public/web.jpg";
import Certificate2 from "../public/dsa.jpg";
import Certificate3 from "../public/node.jpg";
import Certificate4 from "../public/aws.jpg";
const Certificates = () => {
  const tabs = [
    {
      title: "Web Dev",
      value: "web dev",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>Web Dev Bootcamp</p>
          <Image
            src={Certificate1}
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "DSA C++",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>DSA C++</p>
          <Image
            src={Certificate2}
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Node js",
      value: "node js",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>Node js</p>
          <Image
            src={Certificate3}
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "AWS",
      value: "aws",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-lg md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>AWS</p>
          <Image
            src={Certificate4}
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className=" heading">
        Certi<span className=" text-purple">ficates</span>
      </h1>
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Certificates;
const DummyContent = () => {
  return (
    <Image
      src={Certificate1}
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
