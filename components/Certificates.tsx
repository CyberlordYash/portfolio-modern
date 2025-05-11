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
        <div className="w-full overflow-hidden relative h-full rounded-md p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-800 to-indigo-800">
          <p>Web Dev Bootcamp</p>
          <a href="https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/">
            <Image
              src={Certificate1}
              alt="dummy image"
              width="1000"
              height="1000"
              className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-md mx-auto"
            />
          </a>
        </div>
      ),
    },
    {
      title: "DSA C++",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-md p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>DSA C++</p>
          <a href="https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/">
            <Image
              src={Certificate2}
              alt="dummy image"
              width="1000"
              height="1000"
              className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
            />
          </a>
        </div>
      ),
    },
    {
      title: "Node js",
      value: "node js",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-md p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-violet-800 to-indigo-800">
          <p>Node js</p>
          <a href="https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/">
            <Image
              src={Certificate3}
              alt="dummy image"
              width="1000"
              height="1000"
              className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-md mx-auto"
            />
          </a>
        </div>
      ),
    },
    {
      title: "AWS",
      value: "aws",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-md p-10 text-lg md:text-4xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600">
          <p>AWS</p>
          <a href="https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq">
            <Image
              src={Certificate4}
              alt="dummy image"
              width="1000"
              height="1000"
              className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-md mx-auto"
            />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className=" w-[100%] m-[auto] mt-2 p-6 rounded-2xl bg-white  dark:bg-black">
      <h1 className=" heading font-Orbitron">
        Certi<span className=" text-violet-700 dark:text-purple">ficates</span>
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
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-md mx-auto"
    />
  );
};
