import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";
import { motion } from "framer-motion";

const Grid = () => {
  return (
    <div id="about">
      <BentoGrid className=" w-[100%] m-[auto] mt-6 p-2 rounded-2xl bg-white  dark:bg-black overflow-hidden">
        {gridItems.map(
          ({
            id,
            title,
            description,
            className,
            img,
            imgClassName,
            titleClassName,
            spareImg,
          }) => (
            <BentoGridItem
              id={id}
              key={id}
              title={title}
              description={description}
              className={className}
              img={img}
              imgClassName={imgClassName}
              titleClassName={titleClassName}
              spareImg={spareImg}
            />
          )
        )}
      </BentoGrid>
    </div>
  );
};

export default Grid;
