import React from "react";
import { Oval, Triangle } from "react-loader-spinner";

type LoaderProps = {
    height:string;
    width:string;
}

const Loader = ({height,width}:LoaderProps) => {
  return (
    <>
      <Oval
        visible={true}
        height={height}
        width={width}
        color="#fa3232"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        secondaryColor="#ff7070"
      />
    </>
  );
};

export default Loader;
